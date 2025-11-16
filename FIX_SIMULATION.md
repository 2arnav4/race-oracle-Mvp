# 🏎️ How to Fix and Start the Simulation

## The Issue

The Play button wasn't showing because of a TypeScript issue with duplicate type definitions. This has been fixed!

## What to Do Now

### Step 1: Refresh Your Browser

Press `Ctrl+R` (or `Cmd+R` on Mac) to refresh the page.

### Step 2: You Should See

1. **Right Panel**: 15 scenario options (Scenario 1, 2, 3, etc.)
2. **Top Center**: A green **"▶ Play"** button
3. **Main Area**: Monza track with "Ready to Race" message

### Step 3: Start the Simulation

1. **Click on a Scenario** on the right panel (e.g., "Scenario 1")
2. **Click the "▶ Play" button** at the top center
3. **Watch the race!** Cars will start moving around the track

## If It Still Doesn't Work

### Check Backend is Running

```bash
curl http://localhost:8000/data/scenarios
```

You should see JSON with 15 scenarios. If not, restart the backend:

```bash
cd backend/src
python3 main.py
```

### Check Frontend is Running

Make sure you see:
```
  VITE ready in xxx ms
  ➜  Local:   http://localhost:5173/
```

If not, restart the frontend:

```bash
npm run dev
```

### Clear Browser Cache

1. Press `F12` to open Developer Tools
2. Right-click the refresh button
3. Select "Empty cache and hard refresh"

## Expected Behavior

### Before Clicking Play
- "Ready to Race" message in center
- Scenarios listed on right
- Play button at top center

### After Clicking Play
- Message disappears
- Cars appear on track
- Cars move smoothly around Monza
- Speeds update in real-time
- Tire wear shows as progress bars

## Troubleshooting

| Problem | Solution |
|---------|----------|
| No Play button | Refresh browser (Ctrl+R) |
| No scenarios | Restart backend |
| Cars not moving | Click Play button |
| Blank screen | Check browser console (F12) |
| Connection error | Make sure backend is on port 8000 |

## Quick Test

Open browser console (F12) and check for errors. You should see:
```
WebSocket connected
Scenarios loaded: {scenarios: Array(15)}
```

If you see errors, let me know what they say!

---

**The simulation is ready! Just refresh and click Play! 🏁**
