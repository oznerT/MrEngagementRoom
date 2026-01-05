export async function onRequestPost(context) {
    const { request, env } = context;

    try {
        const data = await request.json();
        const { strokes, meta } = data;

        // 1. Validations
        if (!strokes || !Array.isArray(strokes)) {
            return new Response(JSON.stringify({ error: "Invalid data" }), { status: 400 });
        }

        let totalPoints = 0;
        for (const stroke of strokes) {
            if (Array.isArray(stroke)) {
                totalPoints += stroke.length;
            }
        }

        // Minimum complexity check (anti-spam)
        if (totalPoints < 50) { // Adjusted from 120 for testing leniency, can be stiffened
            return new Response(JSON.stringify({ error: "Signature too simple" }), { status: 400 });
        }

        // 2. Prepare Data
        const id = crypto.randomUUID();
        const createdAt = Date.now();
        const ua = request.headers.get("User-Agent") || "unknown";
        const ip = request.headers.get("CF-Connecting-IP") || "127.0.0.1";

        // Simple hash for IP (privacy)
        const msgBuffer = new TextEncoder().encode(ip);
        const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        const ipHash = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

        // 3. Rate Limit Check (Optional Manual Impl or use D1)
        // Check last entry from this hash in last minute
        const { results } = await env.DB.prepare(
            "SELECT count(*) as count FROM signatures WHERE ip_hash = ? AND created_at > ?"
        ).bind(ipHash, createdAt - 60000).all();

        if (results[0].count >= 3) {
            return new Response(JSON.stringify({ error: "Rate limit exceeded" }), { status: 429 });
        }

        // 4. Save to D1
        await env.DB.prepare(
            "INSERT INTO signatures (id, created_at, strokes, points_count, ua, ip_hash) VALUES (?, ?, ?, ?, ?, ?)"
        ).bind(id, createdAt, JSON.stringify(strokes), totalPoints, ua, ipHash).run();

        return new Response(JSON.stringify({ ok: true, id }), {
            headers: { "Content-Type": "application/json" },
            status: 200 // Created
        });

    } catch (err) {
        return new Response(JSON.stringify({ error: err.message }), { status: 500 });
    }
}
