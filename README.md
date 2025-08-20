Markdown Form

Description

This project demonstrates how to render interactive HTML forms directly within Markdown. It leverages the power of `react-markdown` and `remark-gfm` to parse and display the form elements. To ensure security, a `rehype-sanitize` schema is used and extended to safely handle form tags and attributes.

Key Features

- Interactive Forms in Markdown: Seamlessly embed and render HTML forms in your Markdown files.
- Secure: Utilizes `rehype-sanitize` to prevent unsafe HTML and XSS vulnerabilities.
- React + Vite: Built with a modern and fast frontend toolchain.

Technologies Used

- React
- Vite
- react-markdown
- remark-gfm
- rehype-sanitize

Installation

1. Clone the repository:
   git clone https://github.com/abhishek-deshmukh-el/markdown-form.git

2. Navigate to the project directory:
   cd markdown-form

3. Install the dependencies:
   yarn

Usage

Development

To start the development server, run:
yarn dev

Build

To create a production build, run:
yarn build

Preview

To preview the production build locally, run:
yarn preview

Contributing

Contributions are welcome! Please feel free to open an issue or submit a pull request.