// let a = [1,2,3,4,5]
// let rev = []
// for(let i = a.length-1; i>=0; i--){
//  rev.push(a[i])    
// }
// console.log(rev)

// let a = ["madam"]
// let rev = a[0].split("").join("")

// console.log(rev)

let arr = [1,2,2,3,4,4,5]
 let abb = []
 for(let i = 0; i<arr.length; i++){
    if(abb.includes(arr[i])===false){
        abb.push(arr[i])
    }
 }
 console.log(abb)
