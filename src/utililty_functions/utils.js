// Function for searching the array of objects and returing the object whose id matches with the passed id
export function searchArray (arr, id) {
    for (let i in arr) {
        if (arr[i].id === id) {
            return arr[i];
        }
    }
}

// Function for determining if an object is in an array of objects or not
export function notInArray (arr, obj) {
    for (let i in arr) {
        if (arr[i].id === obj.id) {
            return false;
        }
    }
    return true;
}

// Function for removing an object from an array of objects whose id is passed into the function
export function removeFromArray (arr, id) {
    let new_arr = [];
    for (let i in arr) {
        if (arr[i].id !== id) 
            new_arr.push(arr[i]);            
    }
    return new_arr;
}

