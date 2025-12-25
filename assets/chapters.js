const params = new URLSearchParams(window.location.search);
const chapterNum = parseInt(params.get('chapter')) || 1;

fetch('https://vedicscriptures.github.io/chapters')
    .then(res => res.json())
    .then(chapters => {

        const chapter = chapters.find(
            ch => ch.chapter_number === chapterNum
        );

        document.getElementById('chapterHeader').innerHTML = `
      <h2>Chapter ${chapter.chapter_number}: ${chapter.name}</h2>
      <p><strong>${chapter.verses_count} Verses</strong></p>
    `;

        const totalVerses = chapter.verses_count;

        let verseHTML = '';
        let verseButtonsHTML = '';

        const requests = [];

        for (let i = 1; i <= totalVerses; i++) {
            requests.push(
                fetch(`https://vedicscriptures.github.io/slok/${chapterNum}/${i}`)
                    .then(res => res.json())
            );
        }

        Promise.all(requests).then(allVerses => {

            allVerses.forEach(v => {

                verseHTML += `
                <div class="mb-5" id="verse-${v.verse}">
                <span class="text-danger fw-bold">Verse ${v.verse}</span>
                <p>${v.translation?.en || v.slok}</p>
                </div>
  `;

                verseButtonsHTML += `
    <button class="btn btn-outline-secondary btn-sm"
      onclick="scrollToVerse(${v.verse})">
      ${v.verse}
    </button>
  `;
            });


            document.getElementById('versesContent').innerHTML = verseHTML;
            document.getElementById('verseButtons').innerHTML = verseButtonsHTML;
        });

        document.getElementById('prevChapter').onclick = () => {
            if (chapterNum > 1) {
                window.location.href = `?chapter=${chapterNum - 1}`;
            }
        };

        document.getElementById('nextChapter').onclick = () => {
            if (chapterNum < chapters.length) {
                window.location.href = `?chapter=${chapterNum + 1}`;
            }
        };

    });

function scrollToVerse(num) {
  const verseElement = document.getElementById(`verse-${num}`);
  if (verseElement) {
    verseElement.scrollIntoView({
      behavior: 'smooth',
      block: 'start'
    });
  }
}


// Chapters Page Code
