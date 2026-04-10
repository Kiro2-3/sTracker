# Confetti Effect on Transaction Success

## Steps:
1. [ ] Add canvas-confetti CDN script to `resources/views/app.blade.php`
2. [ ] Update `resources/js/Pages/AddTransaction.vue`: Add `showSuccessToast` call and `confetti()` trigger in `onSuccess` callback
3. [ ] Rebuild assets with `npm run dev` or `npm run build`
4. [ ] Test: Submit transaction → verify toast + confetti → modal closes successfully
5. [ ] Complete task
