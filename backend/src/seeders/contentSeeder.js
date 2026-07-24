import dotenv from "dotenv";
import connectDB from "../config/database.js";
import Page from "../models/Page.js";
import Admin from "../models/Admin.js";

dotenv.config();

const seedContent = async () => {
  try {
    await connectDB();

    console.log("🌱 Seeding Content Pages...");

    const admin = await Admin.findOne({ email: process.env.ADMIN_EMAIL });
    const adminId = admin ? admin._id : null;

    // Seed Data Pages
    const pages = [
      {
        title: "Home Page",
        slug: "home",
        description: "Public landing page for RenewCred platform with rich content blocks",
        status: "published",
        createdBy: adminId,
        blocks: [
          {
            type: "header",
            order: 0,
            data: {
              text: "Welcome to RenewCred CMS & Financial Engine",
              level: 1,
              subtitle: "Decentralized credit management & structured dynamic content",
            },
          },
          {
            type: "paragraph",
            order: 1,
            data: {
              text: "RenewCred provides enterprise-grade infrastructure for managing credit metrics, mathematical risk models, dynamic documentation, and rich modular content blocks seamlessly across web interfaces.",
            },
          },
          {
            type: "equation",
            order: 2,
            data: {
              title: "Standard Deviation & Risk Variance Formula",
              equation: "\\sigma = \\sqrt{\\frac{1}{N} \\sum_{i=1}^N (x_i - \\mu)^2}",
              displayMode: true,
              caption: "Used in real-time portfolio volatility computation",
            },
          },
          {
            type: "table",
            order: 3,
            data: {
              title: "Quarterly Performance Matrix",
              headers: ["Metric", "Q1 2026", "Q2 2026", "Variance"],
              rows: [
                ["Average Credit Score", "742", "785", "+5.79%"],
                ["Total Asset Under Management", "$14.2M", "$21.8M", "+53.52%"],
                ["Protocol Default Rate", "0.38%", "0.24%", "-36.84%"],
                ["Active Verified Users", "18,400", "29,150", "+58.42%"],
              ],
            },
          },
          {
            type: "list",
            order: 4,
            data: {
              title: "Core Platform Features",
              style: "bullet",
              items: [
                "Automated Underwriting & Real-time Risk Assessment",
                "Decentralized Credit Identity Verification",
                "Headless Content Management with Rich Text & KaTeX Support",
                "Instant Cloudinary Asset Optimization and Document Storage",
              ],
            },
          },
          {
            type: "nested_list",
            order: 5,
            data: {
              title: "System Architecture Layers",
              items: [
                {
                  text: "Core Microservices",
                  children: [
                    "Authentication Gateway (JWT & Bcrypt)",
                    "Content & Page Engine (Mongoose / MongoDB)",
                    "Media Asset Pipeline (Multer & Cloudinary)",
                  ],
                },
                {
                  text: "Presentation Tier",
                  children: [
                    "Admin Dashboard (React & Redux Toolkit)",
                    "Public Website (Next.js / KaTeX Dynamic Parser)",
                  ],
                },
              ],
            },
          },
        ],
      },
      {
        title: "Mathematical Risk Specifications",
        slug: "math-specifications",
        description: "Structured actuarial formulas and mathematical credit models",
        status: "published",
        createdBy: adminId,
        blocks: [
          {
            type: "header",
            order: 0,
            data: {
              text: "Mathematical & Actuarial Credit Models",
              level: 1,
            },
          },
          {
            type: "paragraph",
            order: 1,
            data: {
              text: "All calculations are validated backend-side and rendered with LaTeX math typesetting on the client.",
            },
          },
          {
            type: "equation",
            order: 2,
            data: {
              title: "Normal Probability Density Function",
              equation: "f(x) = \\frac{1}{\\sigma \\sqrt{2\\pi}} e^{-\\frac{1}{2}\\left(\\frac{x-\\mu}{\\sigma}\\right)^2}",
              displayMode: true,
            },
          },
          {
            type: "equation",
            order: 3,
            data: {
              title: "Present Value Discounting Formula",
              equation: "PV = \\sum_{t=1}^n \\frac{C_t}{(1+r)^t} + \\frac{FV}{(1+r)^n}",
              displayMode: true,
            },
          },
          {
            type: "equation",
            order: 4,
            data: {
              title: "Euler's Identity",
              equation: "e^{i\\pi} + 1 = 0",
              displayMode: false,
            },
          },
        ],
      },
      {
        title: "Developer Documentation",
        slug: "documentation",
        description: "Integration guide for Headless CMS endpoints",
        status: "published",
        createdBy: adminId,
        blocks: [
          {
            type: "header",
            order: 0,
            data: {
              text: "RenewCred Headless API Documentation",
              level: 1,
            },
          },
          {
            type: "documentation",
            order: 1,
            data: {
              section: "Authentication",
              endpoint: "POST /api/v1/auth/login",
              description: "Authenticate admin user and obtain JWT access token.",
              codeSnippet: "curl -X POST http://localhost:5000/api/v1/auth/login -H 'Content-Type: application/json' -d '{\"email\":\"admin@renewcred.com\",\"password\":\"Admin123\"}'",
            },
          },
          {
            type: "documentation",
            order: 2,
            data: {
              section: "Public Page Fetching",
              endpoint: "GET /api/v1/pages/slug/:slug",
              description: "Fetch dynamic page by unique slug without authorization header.",
              codeSnippet: "curl http://localhost:5000/api/v1/pages/slug/home",
            },
          },
        ],
      },
    ];

    for (const pageData of pages) {
      await Page.findOneAndUpdate(
        { slug: pageData.slug },
        pageData,
        { upsert: true, returnDocument: "after" }
      );
      console.log(`✅ Seeded page: /${pageData.slug}`);
    }

    console.log("🎉 Content Seeding Completed Successfully!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Content Seeding Failed:", error);
    process.exit(1);
  }
};

seedContent();
