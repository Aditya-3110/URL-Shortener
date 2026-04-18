router.get("/:shortId", async (req, res) => {
  const { shortId } = req.params;

  console.log("🔥 Redirect hit:", shortId);

  try {
    let cachedUrl = null;

    // 🔥 Redis check
    try {
      cachedUrl = await redis.get(shortId);
    } catch {
      console.log("Redis read failed ⚠️");
    }

    // ✅ FROM REDIS
    if (cachedUrl) {
      console.log("⚡ From Redis");

      await Url.updateOne(
        { shortId },
        { $inc: { clicks: 1 } }
      );

      return res.redirect(cachedUrl);
    }

    // 🔥 FROM MONGODB
    const url = await Url.findOne({ shortId });

    if (!url) {
      return res.status(404).json({ message: "URL not found" });
    }

    console.log("🐢 From MongoDB");

    // save to Redis 
    try {
      await redis.set(shortId, url.originalUrl);
    } catch {
      console.log("Redis write failed ⚠️");
    }

    // ✅ ONLY ONE CLICK INCREMENT
    await Url.updateOne(
      { shortId },
      { $inc: { clicks: 1 } }
    );

    return res.redirect(url.originalUrl);

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
});