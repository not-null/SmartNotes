import { rowsNeededForSymbol } from "./symbolsUtils";

export function HtmlToLatex(title) {
  var str = "____________LATEX___________";
  str += "\n";

  //Start LaTeX document
  str += "\\begin{document}";

  //LaTeX Title
  str += "\\title{{" + title + "}}";
  str += "\\*";

  //Hämta ut raderna i dokumentet
  var rowDivs = document.getElementsByClassName("rowDiv");

  //---BÖR RETURNERA ETT TOMT LATEX DOKUMENT---
  if (rowDivs === null || typeof rowDivs === "undefined") {
    return "no rows yet";
  }

  console.log("number of rows: " + rowDivs.length);

  //För varje rad i dokumentet
  for (let row of rowDivs) {
    //TODO: Check if start/stop div?

    //Hämta ut objekt i raden
    let rowContent = row.getElementsByClassName("wordDiv");
    console.log("rowContent-_-_-_-_-_---___---___--->>" + rowContent);
    console.log("rowContent size= " + rowContent.length);

    //För varje objekt i raden
    for (let i = 0; i < rowContent.length; i++) {
      console.log("rowobject------------>" + rowContent[i]);

      // Om det är en wordDiv
      if (rowContent[i].className === "wordDiv") {
        //wordDivens innehåll
        let wordContent = rowContent[i].childNodes;

        //För varje innehåll i wordDiven

        for (let j = 0; j < wordContent.length; j++) {
          //Om det är letter, och den inte ingår i en symbol
          console.log(
            "parents grandparent: " +
              wordContent[j].parentNode.parentNode.parentNode.className
          );
          if (
            wordContent[j].className === "letter" &&
            !wordContent[j].parentNode.parentNode.parentNode.classList.contains(
              "symbolWrapper"
            )
          ) {
            str += wordContent[j].innerHTML;
            console.log("Added letter to latex: " + wordContent[j].innerHTML);
          }

          //Om det är en symbol
          if (wordContent[j].classList.contains("symbolWrapper")) {
            let symbolContents = wordContent[j].childNodes;

            //Simpel symbol
            if (symbolContents.length == 1) {
              str += symbolContents[0].innerHTML;
              return;
            }

            //Funkar endast om det är 3raders
            var symbol = symbolContents[1].innerHTML;

            switch (rowsNeededForSymbol(symbol)) {
              case 2:
                break;
              case 3:
                let upperBoundLetters = getBoundsLetters(symbolContents[0]);
                let lowerBoundLetters = getBoundsLetters(symbolContents[2]);
                str += generateLaTeXsymbol(
                  symbol,
                  upperBoundLetters,
                  lowerBoundLetters
                );
                break;
              default:
            }
          }
        }
      }

      //Om det är en spaceDiv
      if (rowContent[i].className === ".spaceDiv") {
        str += " ";
      }
    }

    str += "\\*";
  }

  //End LaTeX document
  str += "\\end{document}";

  return str;
}

//Only works for letters (no space or symbol)
function getBoundsLetters(boundDiv) {
  let boundLetters = boundDiv.getElementsByClassName("letter");
  let bound = "";

  //Tänker inte på space??
  for (let letter of boundLetters) {
    bound += letter.innerHTML;
  }

  return bound;
}

function generateLaTeXsymbol(symbol, upperBoundLetters, lowerBoundLetters) {
  console.log("UPPER: " + upperBoundLetters);
  console.log("LOWER: " + lowerBoundLetters);
  switch (symbol) {
    case "∫":
      return (
        "$$\\int_{" + lowerBoundLetters + "}^{" + upperBoundLetters + "}$$"
      );
    case "∑":
      return (
        "$$\\sum_{" + lowerBoundLetters + "}^{" + upperBoundLetters + "}$$"
      );
  }
}
