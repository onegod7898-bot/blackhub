# BlackHub Deep Linking & Product Links

## Web (Implemented)

- **Share URL format:** `https://blackhubapp.com/p/{product_id}`
- Products use UUID (Supabase default)
- Share button: Copy, WhatsApp, native share sheet
- Web fallback: product preview + "Open in App" / "Download App"
- "Open in App" tries `blackhub://product/{id}` then redirects to Play Store

## Mobile (Expo – when you build the app)

### app.json

```json
{
  "expo": {
    "scheme": "blackhub",
    ...
  }
}
```

### Linking config

When user opens `blackhub://product/{product_id}`:

1. Extract `product_id` from the URL
2. Navigate to Product Details screen
3. Fetch product from Supabase: `supabase.from('products').select('*').eq('id', product_id).single()`
4. Validate UUID format before querying

### Testing on Android

1. Build: `eas build --platform android`
2. Install the app
3. Test: `adb shell am start -W -a android.intent.action.VIEW -d "blackhub://product/YOUR-PRODUCT-UUID"`
4. Or use a web page with link: `<a href="blackhub://product/UUID">Open</a>`

## Environment Variables

- `NEXT_PUBLIC_APP_URL` – Base URL (e.g. https://blackhubapp.com)
- `NEXT_PUBLIC_PLAY_STORE_URL` – Play Store app URL
