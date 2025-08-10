# VTU SGPA Calculator

During my Engineering journey as a VTU student, I noticed one common frustration calculating SGPA & CGPA manually every semester.

When results are published in marks, we have to manually calculate the SGPA for each semester and then the CGPA… or rely on online tools where we still need to type subject names, codes, internals, and externals manually. It’s time-consuming, error-prone, and honestly… not the best way to spend your time after a long exam season. 😅

## My Solution

 I built a VTU SGPA & CGPA Calculator 🧮 using Next.js + TypeScript + Gemini AI + Radix UI, hosted on Vercel, making the process quick, accurate, and stress-free!

Just upload the screenshot or PDF of your original result and boom you get your SGPA instantly ✨

![VTU SGPA Calculator Screenshot](/public/images/home.png)

## Core Features

-   **Marksheet Input**: Upload marksheet images (PNG, JPG) or PDFs.
-   **AI Data Extraction**: Uses Google's Gemini model via Genkit to automatically extract student details, subject information, and marks from the marksheet.
-   **Manual Entry**: A user-friendly form for manual entry of marks if an image is unavailable or extraction fails.
-   **SGPA Calculation**: Accurately calculates SGPA based on extracted marks and credits.
-   **CGPA Calculator**: A separate tool to calculate overall CGPA from individual semester SGPA scores.
-   **Downloadable Reports**: Generate and download a professional-looking SGPA report in PDF format.
-   **Responsive Design**: Fully responsive interface built with ShadCN UI and Tailwind CSS.

## Tech Stack

-   **Framework**: [Next.js](https://nextjs.org/) (with App Router)
-   **Language**: [TypeScript](https://www.typescriptlang.org/)
-   **AI/Generative**: [Firebase Genkit](https://firebase.google.com/docs/genkit) with [Google's Gemini API](https://ai.google.dev/)
-   **UI Components**: [ShadCN UI](https://ui.shadcn.com/)
-   **Styling**: [Tailwind CSS](https://tailwindcss.com/)

## Getting Started

To run the project locally, follow these steps:

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/bgmanu2426/VTU-SGPA_Calculator.git
    cd VTU-SGPA_Calculator
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Set up environment variables:**
    Create a `.env` file in the root of the project and add your Google AI API key:
    ```
    GEMINI_API_KEY=your_google_ai_api_key
    ```

4.  **Run the development server:**
    ```bash
    npm run dev
    ```

The application should now be running on [http://localhost:9002](http://localhost:9002).

## License

This project is licensed under the MIT License. See the [LICENSE.md](LICENSE.md) file for details.
