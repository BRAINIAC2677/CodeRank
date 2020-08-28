
var tab = document.querySelector("#tab1");




// hardest problem block

// add row
function addRow(ind, nam, rat, si) {
  tab.innerHTML += "<tr><td>"+si+"</td><td>"+ind+"</td><td>"+nam+"</td><td>"+rat+"</td></tr>";
}

// for finding the hardest solved problems
async function findHard() {
  var user_subapi = "https://codeforces.com/api/user.status?handle=";
  tab.innerHTML = "";
  document.querySelector("#error2").textContent = " ";  //for showing error msg

  let user_hand = document.querySelector("#hand").value;
  user_subapi += user_hand;
  var want_no = document.querySelector("#no").value;  //no of problems to show

  // problem no can not be negative
  if(want_no <= 0){
    document.querySelector("#error2").textContent = "NEGATIVE NUMBER OR 0 IS NOT ALLOWED";
    return;
  }

  var res2 = await fetch(user_subapi);
  var user_subdata = await res2.json();
  console.log(user_subdata);

  // checking for invalid handle
  if(user_subdata.status != "OK"){
    document.querySelector("#error2").textContent = "INVALID HANDLE.PLEASE, TRY AGAIN.";
    return;
  }
  console.log(user_subdata);


  // forming the array of all problems with their hardness rating and pos to sort
  var inp = [];
  for(let i = 0; i< user_subdata.result.length; i++){
    if(user_subdata.result[i].verdict != "OK"){
      continue;
    }
    var hardness = user_subdata.result[i].problem.rating;
    inp.push([hardness, i]);
  }

  // sorting based on problem rating
  inp.sort((a, b)=>{
    if(a[0] > b[0]){
      return -1;
    }
    return 1;
  });


  var hard_prblm = [];
  var prev_prblm = "messibarcacharbe";
  for(let i = 0, j = 0;i < inp.length && j < want_no; i++){
    var prblm_name = user_subdata.result[inp[i][1]].problem.name;
    var prblm_ind = user_subdata.result[inp[i][1]].problem.index;
    if(prblm_name != prev_prblm){
      j++;
      hard_prblm.push([prblm_name, prblm_ind, inp[i][0]]);
    }
    prev_prblm = prblm_name;
  }

  // forming the table to show
  tab.innerHTML += "<thead><tr><th scope='col'>SI</th><th scope='col'>PROBLEM INDEX</th><th scope='col'>PROBLEM NAME</th><th scope='col'>PROBLEM RATING</th></thead>"
  for(let j = 0;j < hard_prblm.length; j++){
    addRow(hard_prblm[j][1], hard_prblm[j][0], hard_prblm[j][2], j+1);
  }
}


document.querySelector("#tgh").addEventListener("click", findHard);
// end of hard problem block



// top list block

// add in the top list table
function add(si, hand, ran, rat, cnrat) {
  let col;
  if(rat >= 2400){
    col = "red";
  }
  else if(rat >= 2300){
    col = "#e76f51";
  }
  else if(rat >= 2100){
    col = "#c4501b";
  }
  else if(rat >= 1900){
    col = "#7400b8";
  }
  else if(rat >= 1600){
    col = "blue";
  }
  else if(rat >= 1400){
    col = "#0077b6";
  }
  else if(rat >= 1200){
    col = "green";
  }
  else {
    col = "black";
  }
  document.querySelector("#tab2").innerHTML += "<tr style='color:"+col+"'><td>"+si+"</td><td>"+hand+"</td><td>"+cnrat+"</td><td class='text-uppercase'>"+ran+"</td><td>"+rat+"</td></tr>";
}

// main function for top list
async function ck() {
  document.querySelector('#empty').textContent = "";  //for error msg show
  document.querySelector("#tab2").innerHTML = "";
  let desh =document.querySelector("#country").value.toLowerCase();
  let cntstid = document.querySelector("#cntstid").value;

  let a = "https://codeforces.com/api/user.info?handles=";

  var dd = await fetch("https://codeforces.com/api/contest.standings?contestId="+cntstid+"&from=1&count=550&showUnofficial=false");
  var bb = await dd.json();
  console.log(bb);

  // checking for invalid contst id
  if(bb.status != "OK"){
    document.querySelector('#empty').textContent = "INVALID CONTEST ID.";
    return;
  }

  // iterating over the top min(500, participants no) to form the api for user info
  let i = 0, rr = 0;
  let pos = [];
  while (i < 500 && rr < bb.result.rows.length) {
    for(let c = 0; c < bb.result.rows[rr].party.members.length; c++){
      a += bb.result.rows[rr].party.members[c].handle;
      a += ";";
      pos[i] = rr;
      i++;
    }
    rr++;
  }

  if(a.charAt(a.length-1) === ";"){
    a = a.slice(0, -1);
  }

  // retrieving user info and matching country
  let ar = [];
  fetch(a)
    .then(res => res.json())
    .then(res_js =>{
      console.log(res_js);
      for(let j = 0;j < res_js.result.length; j++){
        if(res_js.result[j].country === undefined){
          continue;
        }
        if(res_js.result[j].country.toLowerCase() === desh){
          ar.push(j);
        }
      }

      // if no participants to show then table won't be formed with a msg
      if(ar.length === 0){
        document.querySelector('#empty').textContent = "NO ONE FROM THIS COUNTRY IN TOP CHART.";
        return;
      }

      // forming the table to show
      document.querySelector("#tab2").innerHTML += "<thead><tr class=''><th scope='col'>SI</th><th scope='col'>HANDLE</th><th scope='col'>CONTEST STANDING</th><th scope='col'>RANK</th><th scope='col'>RATING</th></thead>";
      for(let e = 0; e < ar.length; e++){
        add(e+1, res_js.result[ar[e]].handle, res_js.result[ar[e]].rank, res_js.result[ar[e]].rating, bb.result.rows[pos[ar[e]]].rank);
      }

    })

}


document.querySelector("#srch").addEventListener('click', ck);

// scroll to top button

//Get the button:
mybutton = document.getElementById("myBtn");

// When the user scrolls down 20px from the top of the document, show the button
window.onscroll = function() {scrollFunction()};

function scrollFunction() {
  if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
    mybutton.style.display = "block";
  } else {
    mybutton.style.display = "none";
  }
}

// When the user clicks on the button, scroll to the top of the document
function topFunction() {
  document.body.scrollTop = 0; // For Safari
  document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
}
