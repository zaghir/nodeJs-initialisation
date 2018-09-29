const lib = require('./lib');
const db = require('./db');
const mail = require('./mail');

test('1 ere Test avec Jest', ()=>{
    
});

test('absolute - should return a positive number if input is positive ' ,()=>{
    const resultat = lib.absolute(1);
    expect(resultat).toBe(1);
});

test('absolute - should return a positive number if input is negative ' ,()=>{
    const resultat = lib.absolute(-1);
    expect(resultat).toBe(1);
});

test('absolute - should return 0 if input 0 ' ,()=>{
    const resultat = lib.absolute(0);
    expect(resultat).toBe(0);
});



// jtest propose une fonction pour regrouper les tests 
describe('absolute', () =>{

    it(' should return a positive number if input is positive ' ,()=>{
        const resultat = lib.absolute(1);
        expect(resultat).toBe(1);
    });
    
    it('should return a positive number if input is negative ' ,()=>{
        const resultat = lib.absolute(-1);
        expect(resultat).toBe(1);
    });
    
    it('should return 0 if input 0 ' ,()=>{
        const resultat = lib.absolute(0);
        expect(resultat).toBe(0);
    });

} );

// tester les String
describe('greet' , ()=>{
    it('should return the greeting message' , ()=>{
        const result = lib.greet('YZR');
        // differents facon pour tester une String
        //expect(result).toBe('YZR');
        //expect(result).toContain('YZR');
        expect(result).toMatch(/YZR/i);
    })
});

// tester les tableaux
describe('getCurrencies',()=>{
    it('should return supported currencies', ()=>{
        const result = lib.getCurrencies();

        // too general
        expect(result).toBeDefined();
        expect(result).not.toBeNull();

        // Too specific  ce n'est pas bon de faire des tests specific pour des valeurs 
        expect(result[0]).toBe('USD');
        expect(result[1]).toBe('AUD');
        expect(result[2]).toBe('EUR');
        expect(result.length).toBe(3);

        // Proper way
        expect(result).toContain('USD');
        expect(result).toContain('AUD');
        expect(result).toContain('EUR');
        
        // Ideal way  peu import l'ordre des valeurs 
        expect(result).toEqual(expect.arrayContaining(['EUR', 'AUD', 'USD']))

    });
});

// tester les objets
describe('getProduit', ()=>{
    it('it should return a product with the given id ', ()=>{
        const result = lib.getProduct(1);
        // on passe un objet pour tester le retour de la fonction de type objet
        // dans ce test avec toBe(obj) le testUnitaire est Ko meme si on compare avec le meme objet 
        // toBo test par la reference de l'objet dans la memoire du coup l'objet retourné pas la fonction et l'objet du test n'ont pas la meme reference
        // expect(result).toBe({id:1 , price: 10});

        // on va utiliser la function toEqual car en va tester les valeurs des propriétés de l'objet
        expect(result).toEqual({id:1 , price: 10});
        
        // toMatchObject(obj)  permet de faire des tests plus souple , elle va comparer seulement les propriétés de l objet test avec l'object de la la fontion
        // toEqual(obj)  compare l'integralités des propriétes des deux objects {p1:1, p2:2} # {p1:1, p2:2, p3:3} 
        expect(result).toMatchObject({id:1 , price: 10});
        
        // 3 eme methode  toHaveProperty( property , value)
        expect(result).toHaveProperty('id',1);
    });
});

// tester les exceptions 
describe('registerUser' , ()=>{
    it('should throw if username is falsy' , ()=>{
        // falsy value in javascript :
        // Null , undefined , NaN , '' , 0 , false
        const args = [null , undefined , NaN , '' , 0 , false];
        args.forEach( a =>{
            // exception(callback).toThrow() ; on provoque l'exeption avec les valeurs envoyées à la methode on sais qu'il faut recuperer une exception
            expect( () => { lib.registerUser(a) } ).toThrow();
        });        
    });

    // tester le cas normal
    it('should return  a user object if  valid  username is passed ', ()=>{
        const result = lib.registerUser('YZR');
        expect(result).toMatchObject( {username:'YZR'} );
        expect(result.id).toBeGreaterThan(0);
    });

});

// tester avec les Mock en javascript
describe('applyDiscount', ()=>{
    it('should apply 10% discount if customer has more than 10 points ', ()=>{
        // pour creer un mock dans javascript est plus facile que java , on a  besoin seulement de redefinir la methode à mocké pas besoin de framework comme Mockito ou MockMVS dans java
        // ici on redefini le comportement de la methode getCustomerSync() de l'objet db
        db.getCustomerSync = function(cutomerId){
            console.log('fake reading customer...')
            return { id: cutomerId , points: 20 };            
        }
        const order = { customerId: 1 , totalPrice: 10 } ;
        // ici l'objet lib utilise la db.getCustomerSync() de la doc mocké dans le test unitaire
        // si on a pas mocké cette methode le test n'est plus un test unitaire mais un test d'integration car il utilise un autre servie pour faire le traitement
        // si le server externe ex: db   ne fonction le test est Ko c'est pas un probleme dans la fonction à tester
        lib.applyDiscount(order);        
        expect(order.totalPrice).toBe(9)
    });
});

// tester avec un Mock pour l'envoi de mail 
describe('notifyCustomer', ()=>{
    it('should send an mail to the customer', ()=> {
        // creer le Mock pour la dao
        db.getCustomerSync = function( customerId ){
            return {mail: 'mailMock@'};
        }

        // creer le Mock pour l'envoi de mail
        // il faut savoir que si on cree un mock pour une methode d'un objet , le comportement redefini dans le mock 
        // c'est celui qui sera charger dans memoire ,si on fait appel a cette methode c'est le comportement du mock qui sera utiliser mais pas le vrai comportement
        let mailSent = false ;
        mail.send = function(mail , message){
            mailSent = true ;
        }
        
        lib.notifyCustomer({customerId: 1});  // c'est dans cette methode qu on va faire appel a mail.sent() qui est mocké ici
        
        // on test mailSent = true  ==> mail.sent() est appellée
        expect(mailSent);
    } );
});

// tester avec le Mock fournie apre jest pour l'envoi de mail 
describe('notifyCustomer2', ()=>{
    it('should send an mail to the customer', ()=> {
        // creer le Mock pour la dao
        //  jest.fn() est une fonction qui n'a pas de comportement, elle renvoie des valeurs par des methode et elle joue le role d un mock
        db.getCustomerSync = jest.fn().mockReturnValue({mail: 'a' });
        // send mail ne retourne aucune valeur
        mail.send = jest.fn();
        lib.notifyCustomer( {customerId: 1} ) ;

        // savoir si la methode mail.send est appellé , ici on a pas besoin de creer une variable de test 
        // pour tester l'envoi de mail c'est jest qui le fait avec toHaveBeenCalled()
        expect(mail.send).toHaveBeenCalled();
        // expect(mail.send).toHaveBeenCalledWith('abc' ,{ p:1, a:2});  // 2eme facon pour tester
        // expect(mail.send.mock.calls[0][0]).toBe('a'); // test le param1 de send() => mail =  'mailMock@'
        // expect(mail.send.mock.calls[0][1]).toMatch(/order/);  // test le param1 de send() => message =  'order'
        
    } );
});

