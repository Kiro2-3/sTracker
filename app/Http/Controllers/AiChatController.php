<?php

namespace App\Http\Controllers;

use GuzzleHttp\Client;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class AiChatController extends Controller
{
    /**
     * Handle AI chat requests. If OPENAI_API_KEY is set the request will be proxied
     * to OpenAI's chat completion endpoint. Otherwise, a small canned-responses
     * fallback will provide helpful pointers about using the app.
     */
    public function chat(Request $request)
    {
        $request->validate(['message' => 'required|string']);

        $message = $request->input('message');

        $apiKey = env('OPENAI_API_KEY');
        if (empty($apiKey)) {
            $lower = strtolower($message);
            if (str_contains($lower, 'bank') || str_contains($lower, 'account')) {
                $reply = 'To add a bank account: open Bank Accounts → Add Bank Account. Provide a name and starting balance, then Save. Use the edit button to change details and the delete button to remove an account.';
            } elseif (str_contains($lower, 'transaction') || str_contains($lower, 'expense')) {
                $reply = 'To create a transaction: go to Transactions → Add / New Transaction. Choose a bank account, pick a category, enter the amount and date, then Save. Use filters on the Recent Transactions page to find transactions quickly.';
            } elseif (str_contains($lower, 'category')) {
                $reply = 'Categories are managed under Categories. You can add, edit, and delete categories. Use categories to group transactions and filter reports.';
            } else {
                $reply = 'I can help with: bank accounts, transactions, categories, exporting CSVs, and basic navigation. Try asking \'How do I add a transaction?\' or \'How do I export transactions?\'';
            }

            return response()->json(['message' => $reply]);
        }

        try {
            $client = new Client;
            $res = $client->post('https://api.openai.com/v1/chat/completions', [
                'headers' => [
                    'Authorization' => 'Bearer '.$apiKey,
                    'Content-Type' => 'application/json',
                ],
                'json' => [
                    'model' => 'gpt-3.5-turbo',
                    'messages' => [
                        ['role' => 'system', 'content' => 'You are a concise, friendly assistant for sTracker — an expense tracking web app. Provide actionable, step-by-step instructions and helpful tips about using the interface (bank accounts, transactions, categories, exports). Keep replies short and focused.'],
                        ['role' => 'user', 'content' => $message],
                    ],
                    'max_tokens' => 700,
                    'temperature' => 0.2,
                ],
            ]);

            $body = json_decode((string) $res->getBody(), true);
            $reply = $body['choices'][0]['message']['content'] ?? 'Sorry, I could not generate a response.';

            return response()->json(['message' => $reply]);
        } catch (\Exception $e) {
            Log::error('AI chat error: '.$e->getMessage());

            return response()->json(['message' => 'Sorry, I could not reach the AI service.'], 500);
        }
    }
}
