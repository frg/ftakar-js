# Ftakar [![Code Climate](https://codeclimate.com/github/frg/ftakar-js/badges/gpa.svg)](https://codeclimate.com/github/frg/ftakar-js)
___
### A jQuery plugin that saves input data using Local Storage

### Version
0.1.13

Ftakar is a small jQuery plugin that I decided to implement as extra functionality to my projects. Even though the plugin idea is simple it adds a considerable amount to the traditional html forms.

The plugin is in its very early stages of implementation therefore here's my ToDo lis tup front.

### Todo's

 - Write Tests
 - Fix interval save
 - Implement checkbox save
 - Implement radio button save
 - Save inputs in form domains
 - Save inputs & forms within url domains

###  Installation
___
Clone from minified source.

###  Usage
___
1. Import jQuery
2. Import ftakar-js.js
3. $('input').ftakar();

Example:
```sh
<form>
    <input type="text" name="firstname" id="sqphy">
    <input type="radio" name="sex" value="male" checked="" id="yzath">Male
    <input type="radio" name="sex" value="female" id="ktpwl">Female
    <input type="checkbox" name="vehicle" value="Bike" id="atrpf">I have a bike
    <input type="checkbox" name="vehicle" value="Car" id="sivcy">I have a car
    <input type="date" name="bday" id="mdqgm"
    <input type="color" name="favcolor" id="ljwon">
    <input type="submit" value="Submit" id="kiibp">
</form>
```

```sh
$('input').ftakar({
    // saveOnInterval: 200,
    saveOnInterval: false,
    saveOnChange: true,
    clearOnSubmit: true,
    expireAfterSeconds: false,
});
```

### API
___

### Options
Possible options:
* Bla bla
* bla
* .. I'll continue this later :)

License
----
MIT
