//Проверка поля на пустоту
export function checkIfEmpty() {
    // console.log(this.value);
    const btn = this.form.button;
    if(this.value === '') {
        btn.disabled = 'disabled';
        console.log('btn disabled');
        return;
    } else {
        btn.removeAttribute('disabled');
    }
}