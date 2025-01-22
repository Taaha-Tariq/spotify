export function searchArray (arr, id) {
    for (let i in arr) {
        if (arr[i].id === id) {
            return arr[i];
        }
    }
}

export function notInArray (arr, obj) {
    for (let i in arr) {
        if (arr[i].id === obj.id) {
            return false;
        }
    }
    return true;
}

export function removeFromArray (arr, id) {
    let new_arr = [];
    for (let i in arr) {
        if (arr[i].id !== id) 
            new_arr.push(arr[i]);            
    }
    return new_arr;
}

