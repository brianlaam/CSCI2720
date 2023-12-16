/* I declare that the lab work here submitted is original
except for source material explicitly acknowledged,
and that the same or closely related material has not been
previously submitted for another course.
I also acknowledge that I am aware of University policy and
regulations on honesty in academic work, and of the disciplinary
guidelines and procedures applicable to breaches of such
policy and regulations, as contained in the website.
University Guideline on Academic Honesty:
https://www.cuhk.edu.hk/policy/academichonesty/
Student Name : Lam Hoi Chun
Student ID : 1155192755
Class/Section : CSCI2720
Date : 16-10-2023 */

// Problem 3
// Task 0
// Show btn
document.getElementById('showhidebtn').addEventListener('click', function() {
    var buttonText = this.innerText;
    this.innerText = buttonText === 'Show' ? 'Hide' : 'Show';
})

// Hide btn
  document.getElementById('showhidebtn').addEventListener('click', function() {
    var extraBars = document.querySelectorAll('.extra-bar');
    for (var i = 0; i < extraBars.length; i++) {
      extraBars[i].style.display = extraBars[i].style.display === 'none' ? 'block' : 'none';
    }
})

// Problem 3
// Task 1: Changing align style
var alignmentModes = ['left', 'center', 'right'];
var currentAlignmentMode = 1;

function changeAlignment() {
  var columns = document.querySelectorAll('.textinfo');
  for (var i = 0; i < columns.length; i++) {
    columns[i].style.textAlign = alignmentModes[currentAlignmentMode];
  }

  currentAlignmentMode = (currentAlignmentMode + 1) % alignmentModes.length;
}

// Problem 3
// Task 2: Adding Spotlight 
// Only applicable to the list on the Home page
function addSpotlight() {
    var spotlightText = prompt("Enter a spotlight of the celebrity:");
    if (spotlightText !== null && spotlightText !== "") {
        var spotlightList = document.getElementById('spotlightList');
        var newSpotlightItem = document.createElement('li');
        newSpotlightItem.textContent = spotlightText;
        spotlightList.appendChild(newSpotlightItem);
    }
}

// Problem 3
// Task 3: Progress Bar
function toggleProgressBar() {
    var progressBar = document.getElementById('progressBar');
    progressBar.style.display = progressBar.style.display === 'none' ? 'block' : 'none';
}

window.addEventListener('scroll', function() {
    var progressBar = document.querySelector('.progress-bar');
    var totalHeight = document.body.scrollHeight - window.innerHeight;
    var progress = (window.scrollY / totalHeight) * 100;
    progressBar.style.width = progress + '%';
    progressBar.setAttribute('aria-valuenow', progress);
})

// Problem 4: Submitting Comments
function processform() {
    if(validateInput()){
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
    // get the color choice
    let color = '';

    // check if a color was selected from the radio buttons
    let selectedRadioButton = document.querySelector("input[name=new-color]:checked");
    if (selectedRadioButton) {
        color = selectedRadioButton.value;
    }

    // if not, use the color picker value
    if (!color) {
        color = document.querySelector("#new-color-picker").value;
    }

    // change the fill color of the SVG circle
    newComment.querySelector("circle").setAttribute("fill", color);

    // append it to the div #comments
    document.querySelector("#comments").appendChild(newComment);

    // reset the form to clear the contents
    document.querySelector("form").reset();
    }
}

// Problem 5: Form Validation
function validateInput(){
    event.preventDefault();

    // Validate email format
    var emailInput = document.getElementById('new-email');
    var email = emailInput.value;
    var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        emailInput.classList.add('is-invalid');
        alert("Invalid email")
        return false;
    }

    // Validate comment
    var commentInput = document.getElementById('new-comment');
    var comment = commentInput.value.trim();
    if (comment === '') {
        commentInput.classList.add('is-invalid');
        alert("Invalid comment")
        return false; 
    }
    return true;
}

// Problem 6: Save / Load Comments
function savefile() {
    let comment = document.querySelector("#comments").innerHTML;
    //alert("testing saving ");
    fetch('comment.txt', {
        method: 'PUT',
        body: comment
    });
};

function loadfile() {
    try {
        var http = new XMLHttpRequest();
        http.open('HEAD', 'comment.txt', false);
        http.send();
        if (http.status === 200) {
            fetch('comment.txt').then(res => res.text()).then(txt => {
                // Overwrite the old div#comment
                document.querySelector("#comments").innerHTML = txt;
                console.log(txt)
            });
        } else {
            alert("No file is loaded");
        }
    } catch (error) {
        alert("ERROR")
    }
};