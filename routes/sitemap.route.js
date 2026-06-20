const express = require("express");
const router = express.Router();
const Blog = require("../models/Blogs");

const BASE_URL = "https://riteshmishra.online";
const LAST_MOD = "2026-06-20";

router.get("/sitemap.xml", async (req, res) => {
    try {
        const blogs = await Blog.find(
            { isPublished: true },
            "slug updatedAt"
        ).lean();

        const staticUrls = [
            { loc: `${BASE_URL}/`, priority: "1.0", changefreq: "weekly" },
            { loc: `${BASE_URL}/projects`, priority: "0.9", changefreq: "weekly" },
            { loc: `${BASE_URL}/about`, priority: "0.8", changefreq: "monthly" },
            { loc: `${BASE_URL}/blogs`, priority: "0.8", changefreq: "weekly" },
            { loc: `${BASE_URL}/contact-us`, priority: "0.7", changefreq: "monthly" },
        ]
            .map(
                ({ loc, priority, changefreq }) => `
  <url>
    <loc>${loc}</loc>
    <lastmod>${LAST_MOD}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`
            )
            .join("");

        const blogUrls = blogs
            .map(
                (blog) => `
  <url>
    <loc>${BASE_URL}/blogs/${encodeURIComponent(blog.slug)}</loc>
    <lastmod>${new Date(blog.updatedAt).toISOString().split("T")[0]}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>`
            )
            .join("");

        const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${staticUrls}
${blogUrls}
</urlset>`;

        res.set("Content-Type", "application/xml");
        res.send(xml);
    } catch (err) {
        console.error("Sitemap Error:", err);
        res.status(500).send("Sitemap generation failed");
    }
});

module.exports = router;