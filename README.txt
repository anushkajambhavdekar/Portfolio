ANUSHKA JAMBHAVDEKAR | DEVELOPER WORKSPACE PORTFOLIO
=====================================================

Idea: the portfolio looks like a code editor (VS Code style), which fits
a Computer Science Engineering student. There's a file explorer on the
left, tabs across the top, a command palette (Ctrl K), and a real
terminal panel at the bottom that you can type into. The home page has
a live neural network animation and a TypeScript object that types
itself out.

FILES
  index.html      the whole portfolio (one page, six "files" you open as tabs)
  css/style.css   styling (colours are the variables at the top)
  js/main.js      the editor shell, neural network, terminal, command
                   palette, skills-to-JSON linking, gallery, theme
  about.html, skills.html, Projects.html, gallery.html, contact.html
                  tiny pages that send old links to the right tab

HOW TO USE WITH YOUR GITHUB PAGES REPO
  1. Copy everything from this folder into your repo and replace the old files.
  2. Keep your images where they are (same folder as index.html):
       pro photo.jpeg
       walchand (5).png, walchand (11).jpeg, walchand (2).jpeg
       oracal.png, google student.png, Datascience.png
       pbl.png, pbl 1.jpeg, pbl2.jpeg
       Google Kaggel.png, HCL.png, kalaa.png
       job sim.png, cyber sim.png, data sim.png
  3. The old skill photos (fullstack.jpg, python.webp, database.jpg,
     programming.avif, webdev.avif, Cyber-Security-Icon...jpeg) are not
     used any more. You can delete them.
  4. Commit and push.

WHAT VISITORS CAN DO
  - Click a file in the left explorer, or a tab, to switch pages. Closing
    a tab (x) does not delete anything, it just closes that view.
  - Press Ctrl K (or click the search bar) to open a command palette and
    jump to any file or toggle the theme / terminal.
  - Press Ctrl ` or click the terminal icon to open a real terminal.
    Try: whoami, cat about, open projects, open contact, ls, theme, clear
  - Hover a card on the Skills page to see it highlighted in the JSON file
    next to it.
  - Click a project card to open its own page with an animated diagram.
  - Gallery images are inside the file explorer too, under "gallery".
  - The sun/moon icon (top right) switches between Night and Day themes.
    The choice is remembered.
  - On phones, the explorer becomes a slide-out drawer (hamburger icon,
    top left) and the terminal/skills panels stack instead of sitting
    side by side.

TO EDIT
  - Project links: search for TODO in index.html and paste the exact
    repository links.
  - Wording, status text: edit the matching <section data-view="..."> block
    in index.html.
  - Colours: the CSS variables at the top of css/style.css (--bg, --accent,
    and so on). There is a separate set under [data-theme="day"].
  - Terminal commands: the "commands" object in js/main.js.
  - If an image is missing the page hides it instead of showing a broken icon.
