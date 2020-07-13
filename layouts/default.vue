<template>
  <div>
    <Nuxt />
  </div>
</template>

<style>
body {
  background-color: #fbfbfb;
  font-size: 16px;
  word-spacing: 1px;
  -ms-text-size-adjust: 100%;
  -webkit-text-size-adjust: 100%;
  -moz-osx-font-smoothing: grayscale;
  -webkit-font-smoothing: antialiased;
  box-sizing: border-box;
  font-family: 'Source Sans Pro';
  font-style: normal;
  font-weight: normal;
  font-size: 14px;
  line-height: 24px;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
}
button:focus {
  outline: none;
}

input[type=checkbox] {
    -webkit-appearance: none;
    -moz-appearance: none;
    appearance: none;
    width: 14px;
    height: 14px;
    cursor: pointer;
    position: relative;
    background: #00a11e;
    border-radius: 3px;
}
input[type=checkbox]::before {
    content: url('/checkbox.png');
    padding-bottom: 5px;
    padding-left: 1px;
    position: absolute;
    right: 50%;
    bottom: 50%;
    transform: translate(50%, 50%);
    opacity: 0;
    transition: .1s ease-in;
}
input[type=checkbox]:checked::before {
    opacity: 1;
}
label {
  margin-bottom: 0;
}
</style>
