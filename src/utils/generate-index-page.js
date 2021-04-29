const fs = require('fs-extra');
const glob = require('glob-promise');
const path = require('path');
const util = require('util');

// first, we will get a list of all of the icons in the source folder
glob('src/svg-optimized/*.svg')
  // next, read the files, using svgson to parse
  .then(filePaths =>
    Promise.all(
      filePaths.map(fileName => {
        return new Promise(resolve => {
          fs.readFile(fileName, 'utf-8').then(svg => {
            resolve({ file: fileName, svg });
          });
        });
      }),
    ),
  )
  // iterate throught the list of all icons so we can create a preview for each of them
  .then(files => {
    let allIcons = '';
    let totalNumOfIcons = 0;

    files.forEach((item, index) => {
      const iconName = path.parse(path.basename(item.file)).name;
      const iconEl = `<sti-icon icon="${iconName}"></sti-icon>`;
      const singleBlock = `<div class="uk-text-center uk-margin-bottom">
        <div class="uk-text-large">${iconEl}</div>
        <div class="uk-text-small uk-text-muted">${iconName}</div>
      </div>`;
      allIcons += singleBlock;
      totalNumOfIcons++;
    });

    const content = `      
      <div class="uk-grid-small uk-child-width-1-3@s uk-child-width-1-5@m" uk-grid="masonry: true">${allIcons}</div>      
    `;

    let filename = `src/index.html`;
    const htmlContent = generateHtml(content, totalNumOfIcons);
    fs.writeFileSync(filename, htmlContent, 'utf8');

    process.exit(0);
  });

function generateHtml(content, totalNumOfIcons) {
  return `
  <!DOCTYPE html>
  <html dir="ltr" lang="en">
    <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0, minimum-scale=1.0, maximum-scale=5.0" />
        <title>ShowingTime Web Component Icons</title>

        <!-- UIkit CSS -->
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/uikit@3.6.20/dist/css/uikit.min.css" />      

        <style>
        .uk-navbar-container { background-color: #111!important; }
        .uk-navbar-container .uk-navbar-nav li.uk-active a { color: #fff;}
        </style>

        <script type="module" src="/build/sti-webcomp-test-01.esm.js"></script>
        <script nomodule src="/build/sti-webcomp-test-01.js"></script>
        <!-- UIkit JS -->
        <script src="https://cdn.jsdelivr.net/npm/uikit@3.6.20/dist/js/uikit.min.js"></script>             
    </head>
    <body>
        <nav class="uk-navbar-container uk-navbar uk-sticky uk-sticky-fixed" uk-navbar uk-sticky=>
            <div class="uk-navbar-left">
                <ul class="uk-navbar-nav uk-dark">
                    <li><a href="#" style="color: #fff;"><sti-icon style="font-size: 20px; margin-right:5px;" icon="st_logo_pictogram"></sti-icon> ShowingTime</a></li>
                </ul>
            </div>
        </nav>      
        <main class="uk-margin-large-bottom">
            <section class="uk-section uk-section-muted">
                <div class="uk-container">
                    <div uk-grid>
                        <div>
                            <h1>ShowingTime Web Component SVG icons</h1>
                            <p>Custom designed SVG icons for use in web, iOS, Android, and desktop apps.</p>
                            <h3>Basic usage</h3>
                            <div>To use a icon, populate the "icon" attribute on the sti-icon component:</div>
                            <div style="display:block; background-color: #e6e6e6; padding: 5px 10px; margin-top:20px; border-radius: 3px; font-family: 'Courier New', 'Lucida Console', Consolas, Monaco, 'Liberation Mono', 'DejaVu Sans Mono', 'Bitstream Vera Sans Mono';">
                              &lt;sti-icon icon="ac_unit"&gt;&lt;/sti-icon&gt;
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <section class="uk-section uk-padding-remove uk-margin-top uk-margin-small-bottom">
                <div class="uk-container uk-text-center">
                  <div class="uk-text-meta">Total number of icons: ${totalNumOfIcons}</div>
                </div>
            </section>
            <section class="uk-section">
                <div class="uk-container">
                  ${content}
                </div>
            </section>
        </main>
    </body>
  </html>
  `;
}
