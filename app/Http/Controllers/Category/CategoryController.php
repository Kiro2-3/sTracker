<?php

namespace App\Http\Controllers\Category;

use App\Http\Controllers\Controller;
use App\Http\Requests\Category\StoreCategoryRequest;
use App\Http\Requests\Category\UpdateCategoryRequest;
use App\Models\Category;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class CategoryController extends Controller
{
    /**
     * Display the categories listing page.
     */
    public function index(): Response
    {
        $user = Auth::user();
        $query = $user->categories()->select(['id', 'name']);

        // Filters
        $search = request()->query('search', '');
        $sortBy = request()->query('sort_by', 'name');
        $sortDir = request()->query('sort_dir', 'asc');

        if ($search) {
            $query->where('name', 'like', "%{$search}%");
        }

        // Allow only name sorting for categories for now
        if (! in_array($sortBy, ['name'])) {
            $sortBy = 'name';
        }

        $sortDir = $sortDir === 'desc' ? 'desc' : 'asc';

        $query->orderBy($sortBy, $sortDir);

        // paginate the categories to mirror transactions UI (10 per page)
        $perPage = 10;
        $categories = $query->paginate($perPage)->withQueryString();

        // total count (useful for clients that need an absolute count regardless of paginator meta)
        $totalCount = $user->categories()->count();

        return Inertia::render('Categories', [
            'auth' => ['user' => $user],
            'categories' => $categories,
            'total_count' => $totalCount,
            'filters' => [
                'search' => $search,
                'sort_by' => $sortBy,
                'sort_dir' => $sortDir,
            ],
        ]);
    }

    /**
     * Store a new category.
     */
    public function store(StoreCategoryRequest $request): JsonResponse
    {
        $user = Auth::user();

        $category = Category::create([
            'user_id' => $user->id,
            'name' => $request->validated('name'),
        ]);

        return response()->json([
            'id' => $category->id,
            'name' => $category->name,
        ]);
    }

    /**
     * Update an existing category.
     *
     * @param  UpdateCategoryRequest  $request  the validated request data
     * @param  Category  $category  the category to update
     */
    public function update(UpdateCategoryRequest $request, Category $category): JsonResponse
    {
        if ($category->user_id !== Auth::id()) {
            abort(403);
        }

        $category->update(['name' => $request->validated('name')]);

        return response()->json([
            'id' => $category->id,
            'name' => $category->name,
        ]);
    }

    /**
     * Return usage information for a category before deletion.
     */
    public function usage(Category $category): JsonResponse
    {
        if ($category->user_id !== Auth::id()) {
            abort(403);
        }

        $user = Auth::user();
        $transactionCount = $user->transactions()
            ->where('category', $category->name)
            ->count();

        $replacementOptions = $user->categories()
            ->whereKeyNot($category->id)
            ->orderBy('name')
            ->get(['id', 'name']);

        return response()->json([
            'transaction_count' => $transactionCount,
            'replacement_options' => $replacementOptions,
        ]);
    }

    /**
     * Delete an existing category.
     *
     * @param  Category  $category  the category to delete
     */
    public function destroy(Request $request, Category $category): JsonResponse
    {
        if ($category->user_id !== Auth::id()) {
            abort(403);
        }

        $validated = $request->validate([
            'replacement_category_id' => [
                'nullable',
                'integer',
                Rule::exists('categories', 'id')->where(fn ($query) => $query->where('user_id', Auth::id())),
            ],
        ]);

        $replacementCategoryId = $validated['replacement_category_id'] ?? null;

        if ((int) $replacementCategoryId === $category->id) {
            return response()->json([
                'message' => 'Please choose a different category to move the data into.',
                'errors' => [
                    'replacement_category_id' => ['Please choose a different category.'],
                ],
            ], 422);
        }

        $user = Auth::user();
        $transactionCount = $user->transactions()
            ->where('category', $category->name)
            ->count();

        DB::transaction(function () use ($user, $category, $replacementCategoryId, $transactionCount): void {
            if ($replacementCategoryId && $transactionCount > 0) {
                $replacementCategory = $user->categories()->findOrFail($replacementCategoryId);

                $user->transactions()
                    ->where('category', $category->name)
                    ->update(['category' => $replacementCategory->name]);
            }

            $category->delete();
        });

        return response()->json([
            'message' => $replacementCategoryId && $transactionCount > 0
                ? 'Category deleted and existing data moved successfully.'
                : 'Category deleted successfully.',
        ]);
    }
}
