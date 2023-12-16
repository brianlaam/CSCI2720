// Task 1
let x = prompt("What is your age?");
let y = new Date().getFullYear();
let z = y - x;

alert("You born in " + z);

// Task 2
const a = ["red", "pink", "green"];
console.log(a);

a.splice(1, 1, "orange", "yellow");
console.log(a);

color = prompt("What is your favorite color?");
a.push(color);
console.log(a);

let a_sorted = a.slice().sort(); // slice() does not change the original array
console.log(a);
console.log(a_sorted);

for(let c in a_sorted){
    document.write(c + "<br>");
} 

// Task 3
let hello = () => alert("Helloooo")
hello()

// Simplify the following function code
/* 
function check(year) {
    if (year>3)
        return true;
    else
        return false;
}
*/

check = (year) => (year>3? true: false)
check(2)

// Task 4



