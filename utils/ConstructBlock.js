export const ConstructBlock = (success, type, subtype, user, data) => {
    const block = new Uint8Array(80);
    
    for (let i = 0; i < 8; i++) {
        const shift = 8 * (7 - i);
        block[i] = (type & (0xff << shift)) >> shift; 
    }
    
    if (success)
        block[0] = 0b10000000;

    for (let i = 0; i < 8; i++) {
        const shift = 8 * (7 - i);
        block[8 + i] = (subtype & (0xff << shift)) >> shift; 
    }

    for (let i = 0; i < 8; i++) {
        const shift = 8 * (7 - i);
        block[16 + i] = (user & (0xff << shift)) >> shift; 
    }
    
    for (let i = 0; i < 56; i++)
        block[24 + i] = data[i];
        
    return block;
    
}