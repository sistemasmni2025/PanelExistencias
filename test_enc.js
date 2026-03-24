const crypto = require('crypto');
const keyHex = 'FFC6C797E8D58668A4587F35B58B516A';
const encryptedBase64 = '72JUFKSSMrdhBed20SHR4A==';
const fullPass = '2108jnAd';
const keyBuf = Buffer.from(keyHex, 'hex');

const ciphers = crypto.getCiphers();

// Try all truncations and case variants
for (let len = 1; len <= fullPass.length; len++) {
    const p = fullPass.substring(0, len);
    const variants = [p, p.toUpperCase()];
    
    variants.forEach(v => {
        const buf = Buffer.alloc(16, 0);
        buf.write(v);
        
        ciphers.forEach(alg => {
            try {
                const cipher = crypto.createCipheriv(alg, keyBuf, null);
                cipher.setAutoPadding(false);
                let encrypted = cipher.update(buf).toString('base64');
                encrypted += cipher.final().toString('base64');
                
                if (encrypted === encryptedBase64) {
                    console.log(`!!! MATCH FOUND !!!`);
                    console.log(`Algorithm: ${alg}`);
                    console.log(`Input variant: ${v}`);
                }
            } catch (e) {}
        });
    });
}

console.log('Finished tests.');
