# Diplomski rad saj za organizaciju turnira
demo: <https://futturniri.azurewebsites.net>

backend repo:

frontend repo:

### Koristene tehnologije
- #### Backend
  - MS SQL Server
  - ASP.NET Web API
  - Azure B2C i Azure Storage
- #### Frontend
  - React (Next.js)

### Korisnička hijerarhija 
 
Posmatrajući korisničku hijerarhiju ove aplikacije, možemo da izdvojimo tri različite uloge korisnika:  
-	Administrator – Ima pristup administratorskom panelu, mogućnost pregleda svih resursa (timova, igrača, mečeva i turnira) kao i njihovim upravljanjem (mijenjanjem sadržaja i brisanjem).  
-	Registrovani korisnik – Ima mogućnost logovanja na veb stranicu kao i izmjene podataka profila koje je unio prilikom registracije, može vršiti pregled sadržaja koji se nalazi na stranici, kao i dodavati i modifkovati vlastiti sadržaj . 
-	Gost – Neregistrovani korisnik koji može da pregleda sadržaj veb stranice i da se informiše, ali nema pravo na dodavanje i promjenu sadržaja.

### Početna stranica
Stranica se sastoji od navigacionog menija u zaglavlju, osnovnih informacija o funkcionalnosti sajta, prikaza najboljih igrača i klubova i podnožja sa kontakt informacijama. U zavisnosti od veličine ekrana navigacioni  meni može biti u dva stanja: proširen ili skupljen, takođe čitav sajt je prilagođen za prikaz na ekranima različitih veličina.

 ![image](https://github.com/Dragan321/diplomski_turniri-https-futturniri.azurewebsites.net-/assets/60924925/ca2e68df-3a7a-49b7-a3cb-fccf38e87e69)

### Prijava/Registracija
![image](https://github.com/Dragan321/diplomski_turniri-https-futturniri.azurewebsites.net-/assets/60924925/3a988358-d5e5-44db-b777-cd6e62f35872)

### Upravljanje korisnicima
![image](https://github.com/Dragan321/diplomski_turniri-https-futturniri.azurewebsites.net-/assets/60924925/2be8966d-259d-450a-b8bf-82678b7a914d)
![image](https://github.com/Dragan321/diplomski_turniri-https-futturniri.azurewebsites.net-/assets/60924925/5685da4d-6c0a-4129-bfd2-cb9c9c4f26ef)

### Prelged igraca 
Ukoliko korisnik želi da vrši pregled klubova, igrača i njihove statistike, potrebno je da u navigacionom meniju izabere opciju Timovi  odnosno Igraci. Klikom na opciju Timovi prikazuje se lista svih timova i neke osnovne informacije(naziv, logo, broj pobjeda i golova), radi lakše navigacije korisnici imaju mogućnost pretrage po nazivu tima. Klikom na neku od kartica korisnik može da vidi više informacija o izabranom timu

![image](https://github.com/Dragan321/diplomski_turniri-https-futturniri.azurewebsites.net-/assets/60924925/96853348-0964-4338-86be-339c24470283)
![image](https://github.com/Dragan321/diplomski_turniri-https-futturniri.azurewebsites.net-/assets/60924925/587fe7c1-604b-4109-b8b7-1523c2fed093)
![image](https://github.com/Dragan321/diplomski_turniri-https-futturniri.azurewebsites.net-/assets/60924925/0fa4d1c1-997d-4b23-a61f-7687e19615c7)

### Dodavanje timova i igraca
Forme za dodavanje igraca i timova
![image](https://github.com/Dragan321/diplomski_turniri-https-futturniri.azurewebsites.net-/assets/60924925/8fcf4c7b-2b47-4f2f-885f-da02a1127971)

### Brisanje resursa 
Vlasnici resursa mogu da brisu svoje resurse 
![image](https://github.com/Dragan321/diplomski_turniri-https-futturniri.azurewebsites.net-/assets/60924925/90e63c9b-adcc-4616-8f7e-e91da4867bd1)

### Pregled turnira
Ukoliko korisnik želi da vrši pregled turnira potrebno je da u navigacionom meniju izabere opciju Turniri. Klikom na opciju Turnir prikazuje se lista svih turnira i neke osnovne informacije (naziv, status i datum i lokacija održavanja ). Klikom na neki od turnira korisnik može da vidi odigrane mečeve i rezultate. 

![image](https://github.com/Dragan321/diplomski_turniri-https-futturniri.azurewebsites.net-/assets/60924925/a3871561-f4b8-4e13-9641-341016961f1b)
![image](https://github.com/Dragan321/diplomski_turniri-https-futturniri.azurewebsites.net-/assets/60924925/57dd3353-fe12-4bc6-92a2-3d588bf35147)
![image](https://github.com/Dragan321/diplomski_turniri-https-futturniri.azurewebsites.net-/assets/60924925/54ffa2ee-4ffc-4d3a-8844-1b61be870160)

### Upravljanje turnirima
Forma za kreiranje turnira

![image](https://github.com/Dragan321/diplomski_turniri-https-futturniri.azurewebsites.net-/assets/60924925/a99f5b83-1978-4498-b00c-094f4bfe484e)

Izbor timova koji ce ucestvovati
![image](https://github.com/Dragan321/diplomski_turniri-https-futturniri.azurewebsites.net-/assets/60924925/7fc844d5-4a81-4c97-95d6-eae459cccfb8)

Nakon dodavanja timova mečevi se automatski generišu, pri pregledu mečeva korisnik ima mogućnost dodavanja statistike kao što, a klikom na tipku završi meč, on se označava kao završen i pobjednički tim se automatski prebacuje u sledeću rundu.
![image](https://github.com/Dragan321/diplomski_turniri-https-futturniri.azurewebsites.net-/assets/60924925/27875d20-e3fe-4575-ad04-2954ce4425ec)







