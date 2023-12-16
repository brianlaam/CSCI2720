function processform() {
    // set up a new element
    let newComment = document.createElement("div");
    let element = '<div><svg height="100" width="100"><circle cx="50" cy="50" r="40"></svg></div><div><h5></h5><p></p></div>';
    newComment.innerHTML = element;

    // set the classes of the div and its children div's
    newComment.className = "d-flex";
    newComment.querySelectorAll("div")[0].className = "flex-shrink-0"; // 1st div
    newComment.querySelectorAll("div")[1].className = "flex-grow-1"; // 2nd div

    // increment the comment id
    let lastComment = document.querySelector("#comments").lastElementChild; // #comments refer to the id "comments"
    newComment.id = 'c' + (Number(lastComment.id.substr(1))+1);

    // change contents <h5> and <p> according to form input with id
    newComment.querySelector("h5").innerHTML = document.querySelector("#new-email").value;
    newComment.querySelector("p").innerHTML = document.querySelector("#new-comment").value;

    // get the color choice from the radio buttons
    let color = document.querySelectorAll("input[name=new-color]:checked")[0].value;

    // change the fill color of the SVG circle
    newComment.querySelector("circle").setAttribute("fill", color);

    // append it to the div #comments
    document.querySelector("#comments").appendChild(newComment);

    // reset the form to clear the contents
    document.querySelector("form").reset();
}

/*
function loadfile(){
    let contentElement = document.getElementById("new-comment"); 

    fetch("lab_03_file.txt") // or absolute address http://127.0.0.1:8080/lab_03_file.txt
      .then(response => response.text())
      .then(data => {
        contentElement.textContent = data;
      })
      .catch(error => {
        console.error("Error fetching data:", error);
      });
}


function savefile(){
  const textInput = document.getElementById('new-comment');
  const text = textInput.value; // to retrieve the value, i.e., a string, in the HTML element

  fetch("http://127.0.0.1:8080/user_input.txt", {
    method:"PUT",
    body: text
  })
  .catch(error => {
    console.error("Error saving data:", error);
  });
}


function savefile() {
  let comment = document.getElementById("comments").innerHTML;
  //alert("testing saving ");
  fetch("http://127.0.0.1:8080/user_input.txt", {
      method: 'PUT',
      body: comment
  })
  .then(alert("File saved."));
};

window.onload = function() {
  loadfile();
};


function savefile() {
  let comment = document.getElementById("comments").innerHTML;
  fetch("http://127.0.0.1:8080/user_input.txt", {
      method: 'PUT',
      body: comment
  })
  .then(response => {
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    alert("File saved.");
  })
  .catch(error => console.error('Error saving file:', error));
};
*/

function savefile(){
  const textInput = document.getElementById('new-comment');
  const text = textInput.value; // to retrieve the value, i.e., a string, in the HTML element

  fetch("http://127.0.0.1:8080/user_input.txt", {
    method:"PUT",
    body: text
  });
}

function loadfile() {
  try {
      var http = new XMLHttpRequest();
      http.open('HEAD', 'user_input.txt', false);
      http.send();
      if (http.status === 200) {
          fetch('http://127.0.0.1:8080/user_input.txt').then(res => res.text()).then(txt => {
              // directly cover the old div#comment
              document.querySelector("#comments").innerHTML = txt;
              console.log(txt)
          });
          alert("File loaded");
      } else {
          alert("No file is loaded");
      }
  } catch(error){
  }

};

