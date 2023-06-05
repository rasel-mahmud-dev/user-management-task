function generatePinCode(len = 4) {
    let pin = ""
    for (let i = 0; i < len; i++) {
        let n = Math.floor(Math.random() * 9)
        pin += n
    }
    return pin
}

export default generatePinCode