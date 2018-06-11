## 1

~~~bash
npm install react react-dom --save
npm install webpack --save-dev 
// save means project online-package
// save dev means project dev package

git rm -r --cached .
~~~

## 2

~~~js
// ts interface 编译后消失
class Student {
    fullName: string;
    constructor(public firstName, public middleInitial, public lastName) {
        this.fullName = firstName + " " + middleInitial + " " + lastName;
    }
}
// ts中构造方法属性编译后同样传给this对象
~~~

~~~bash
npm install --save react react-dom @types/react @types/react-dom
"That @types/ prefix means that we also want to get the declaration files for React and React-DOM. "
npm install --save-dev typescript awesome-typescript-loader source-map-loader
"Both of these dependencies will let TypeScript and webpack play well together. awesome-typescript-loader helps Webpack compile your TypeScript code using the TypeScript’s standard configuration file named tsconfig.json. source-map-loader uses any sourcemap outputs from TypeScript to inform webpack when generating its own sourcemaps. This will allow you to debug your final output file as if you were debugging your original TypeScript source code."
~~~

