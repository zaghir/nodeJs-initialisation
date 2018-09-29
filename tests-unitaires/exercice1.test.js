const lib =require('./exercise1');

describe('exerice1' , ()=>{

    it('should throw an exeption in input in not a number', () => {
        expect(()=> { lib.fizzBuzz('toto') } ).toThrow();
        expect(()=> { lib.fizzBuzz(null) } ).toThrow();
        expect(()=> { lib.fizzBuzz(false) } ).toThrow();
        expect(()=> { lib.fizzBuzz({}) } ).toThrow();
        expect(()=> { lib.fizzBuzz(undefined) } ).toThrow();
    });
    
    it('doit retourner FizzBuzz si nombre passé est devisible par 3 et 5', ()=>{
        const result = lib.fizzBuzz(15)
        expect(result).toBe('FizzBuzz');        
    });

    it('doit retourner Fizz si nombre passé est nombre devisible par 3 ', ()=>{
        const result = lib.fizzBuzz(9)
        expect(result).toBe('Fizz');        
    });

    it('doit retourner Buzz si nombre passé est nombre devisible par 5 ', ()=>{
        const result = lib.fizzBuzz(25)
        expect(result).toBe('Buzz');        
    });

    it('doit retourner la valeur saisie si nombre passé n\'est pas devisible par 3 ou 5 ', ()=>{
        const result = lib.fizzBuzz(1)
        expect(result).toBe(1);        
    });

});
