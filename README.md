# Aplikacja do rezerwacji miejsc pracy

Witaj! Przeglądasz właśnie kod źródłowy do aplikacji, która daje możliwość na zarządzanie miejscami pracy w biurze, wyposażeniem biura, a także kadrą.

### Instalacja

> Uwaga! Musisz mieć zainstalowaną wersję PHP wersji 7.3 lub nowszą, Node.js wersji 8 lub nowszą, Composer oraz Yarn lub NPM.

Zklonuj lub pobierz to repozytorium do dowolnego folderu na dysku. Zainstaluj zależności PHP:

```
composer install
```

Następnie zainstaluj zależności JavaScript:

```
npm install
// lub
yarn install
```

### Uruchomianie

Przed uruchomieniem aplikacji musisz skompilować pliki JavaScript w wierszu poleceń:

```
yarn build
// lub
npm run build
```

Jeśli potrzebujesz podglądu do map źródłowych (sourcemaps) to skompiluj pliki za pomocą tych poleceń:

```
yarn dev
// lub
npm run dev
```

Aby uruchomić serwer deweloperski, będąc w folderze z plikami aplikacji wpisz w wierszu poleceń:

```
php bin/console server:run
```

Po uruchomieniu serwera deweloperskiego wpisz w przeglądarce adres `http://localhost:8000`

> Port serwera deweloperskiego może być inny. Śledź komunikaty w wierszu poleceń

### Zasada działania aplikacji

Aplikacja posiada dwa typy użytkowników: Administrator oraz Użytkownik. Administrator ma uprawnienia do tworzenia nowych Użytkowników (pracowników biura), do dodawania wyposażenia biura oraz zarządzania miejscami pracy. Aby zalogować się jako administrator skorzystaj z następujących danych:

```
login: admin@mail.com
password: admin
```

Po zalogowaniu się jako administrator zobaczysz kokpit aplikacji z 4 odnośnikami do odpowiednich modułów.
Aby zalogować się jako Użytkownik zobacz najpierw listę już dodanych użytkowników. Dla każdego login i hasło to jest jego adres email.
