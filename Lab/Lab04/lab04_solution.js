// Task 1: remove duplicated values in array
// use .sort() and .includes()
function uniq1(arr) {
    // arr.sort();
    let ans = [arr[0]];
    for(let i = 1; i < arr.length; i++) {
        if(!ans.includes(arr[i])) {
            ans.push(arr[i]);
        }
    }
    return ans;
}

// use .filter() and .indexOf()
function uniq2(arr){
    let ans = arr.filter((value, index, self) => {
        return self.indexOf(value) === index; // .indexOf() returns the index of the first occurrence
      });
    return ans;
}

let array = [1, 2, 3, 6, 5, 3, 2];
let answer = uniq1(array);
console.log(answer);


// Task 2: counting string length in an array
// const materials = ['Hydrogen', 'Helium', 'Lithium', 'Beryllium'];
// const lengths = materials.map(material => material.length);
// console.log(lengths);


// Task 3: build a magic image
const para = document.getElementById('para');

function mouseOver() {
    para.textContent = 'The mouse is not the secret!';
}

function mouseOut() {
    para.textContent = '';
}

document.addEventListener('keydown', (event) => {
    if (event.key === 's' || event.key === 'S') {
        para.textContent = 'S is the secret!';
    } else {
        para.textContent = 'This key is not the secret.';
    }
});

document.addEventListener('keyup', () => {
    para.textContent = '';
});