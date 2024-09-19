"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
let a = 1;
let callFunctionCalled = false; // Flag to track whether the call() function has been called
const interval1 = setInterval(function () {
    return __awaiter(this, void 0, void 0, function* () {
        a++;
        console.log("before if");
        console.log(a);
        yield new Promise(function (resolve) {
            setTimeout(resolve, 1000);
        });
        // const prec = await getPrecision("INJ")
        const prec = 2;
        console.log(prec);
        // await new Promise(function (resolve) {
        //     setTimeout(resolve, 1000)
        // })
        if (a > 3 && !callFunctionCalled) { // Check if the call() function has not been called yet
            console.log(a);
            console.log("inside if");
            clearInterval(interval1);
            call();
            callFunctionCalled = true; // Set the flag to true
        }
        else if (!callFunctionCalled) {
            console.log("hello");
        }
        console.log("after if");
    });
}, 10);
function call() {
    return __awaiter(this, void 0, void 0, function* () {
        console.log("inside call1");
        console.log("inside call2");
        console.log("inside call3");
        console.log("inside call4");
        console.log("inside call5");
        console.log("inside call6");
        console.log("inside call7");
        // await new Promise(function (resolve) {
        //     setTimeout(resolve, 10000)
        // })
        console.log("below setTimeout");
        console.log("below setTimeout");
        console.log("below setTimeout");
        console.log("below setTimeout");
    });
}
