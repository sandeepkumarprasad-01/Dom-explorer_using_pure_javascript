# dom explorer task manager

yeh ek simple task manager project hai jo bilkul scratch se banaya gaya hai. isme sirf html, css aur vanilla javascript ka use kiya hai. koi react ya external library nahi hai taaki samajh aaye ki browser actually kaam kaise karta hai aur dom elements ko kaise render karta hai.

## links
* live version: (yaha apna link daal dena)

## fast overview

yeh app ek mast task board ki tarah kaam karta hai. tum tasks add kar sakte ho, category ke hisaab se filter kar sakte ho, search kar sakte ho, aur dark mode toggle kar sakte ho. maine isme localstorage bhi daala hai taaki page refresh karne par tumhare tasks delete na ho jaye. 

is assignment ka main point ye tha ki browser ka rendering pipeline aur core dom concepts samajh aaye. niche maine apne notes likhe hai ki background me actually kya chal raha hai:

### browsers actually kaise kaam karte hai

**tokenization aur parsing**
jab tum kisi site par jaate ho, toh browser raw html file ko basic text ki tarah download karta hai. fir yeh is text ko tokenizer me bhejta hai jo raw text ko tod kar alag alag html tags banata hai. iske baad parsing ka kaam start hota hai jo in tokens ko validate karta hai aur sahi se organize karta hai.

**trees banana (dom aur cssom)**
* **dom tree:** parser in parsed tags ka use karke document object model (dom) tree banata hai. yeh ek badi family tree jaisi hoti hai jo batati hai ki page par kaunsa element kiska parent ya child hai.
* **cssom tree:** jab html me css files ka link milta hai, tab browser css rules ko bhi parse karta hai. saare styles ko mila kar ek alag structure banta hai jisko css object model (cssom) kehte hai.

**render tree**
browser dom aur cssom ko mila kar ek render tree banata hai. sabse bada farq yeh hai ki render tree me sirf wahi chize aati hai jo actually user ko screen par dikhne wali hoti hai. agar tumne kisi element me display: none lagaya hai, toh wo background me dom tree me toh rahega, par render tree usko poori tarah ignore kar dega taaki processing power bache. is tree ke banne ke baad, browser layout (size aur position) nikalta hai aur finally paint (screen par pixels dalna) karta hai.

### javascript events handle karna

**event bubbling vs capturing**
jab tum app me kisi bhi chiz par click karte ho, toh click event ek specific order me travel karta hai:
1. **capturing phase:** click event sabse pehle window ke top se start hota hai, html root se hote hue niche apne specific target button tak jaata hai.
2. **bubbling phase:** jaise hi event target par lagta hai, wo palat jata hai aur wapas upar ki taraf "bubble" hota hai, bilkul usi raste se jaha se aaya tha.
jab tak tum manually { capture: true } nahi likhte, tab tak javascript ke standard addeventlistener hamesha bubbling phase me hi trigger hote hai.

**event delegation**
har ek task button par alag alag event listener lagana bekar hai (memory jyada leta hai aur naye tasks add karne par break hone ka darr rehta hai). isiliye maine event delegation ka use kiya. maine sirf ek click listener main parent container par lagaya hai jiske andar saare tasks aate hai. bubbling phase ki wajah se, kisi bhi child button par click karne se wo khud-b-khud parent container tak pahoch jaata hai. parent container bas event.target check karta hai ki kis child ne trigger kiya, aur us hisaab se delete ya edit ka function chala deta hai.

### html attributes vs dom properties
form ka data nikalte time maine in dono ke farq par dhyan diya:
* **html attribute:** yeh wo hardcoded data hota hai jo seedha raw html tag ke andar likha hota hai (jaise .getattribute('value') use karke nikalna). yeh initial state batata hai.
* **dom property:** yeh ek live aur active value hoti hai jo current javascript object me store hoti hai (jaise normally input.value check karna).
agar tum input box me koi naya text type karte ho, toh dom property turant real-time me update ho jaati hai, par html attribute bilkul khali ya wahi purana hi rehta hai jaisa original code me likha tha.