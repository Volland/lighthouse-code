/* ==========================================================================
   story.de.js — DER GANZE DEUTSCHE TEXT DES BUCHES an einem Ort.
   Das ukrainische Geschwister liegt daneben: content/story.uk.js. Die Namen
   der Aufgaben (id) sind in beiden Dateien gleich — darum wandern die Sterne
   von einer Sprache in die andere mit.

   Hier steckt keine Logik: nur die Geschichte, die Erklärungen, die Diagramme
   und die Beispiele. Gezeichnet wird das alles von js/book.js. Wer das Buch
   ändern will, ändert nur diese Datei.

   Bausteine eines Kapitels:
     {t:'story',   p:[...]}                 — Absätze der Geschichte
     {t:'max',     p:[...]}                 — Max’ Stimme (Notiz am Rand)
     {t:'postcard',from, stamp, p:[...]}    — Postkarte von Tsugi
     {t:'pull',    html}                    — hervorgehobener Gedanke
     {t:'journal', title, blocks:[...]}     — eine Seite aus dem Logbuch (Papier)
     {t:'h3'|'p'|'small', text|html}        — Überschrift / Absatz / Kleingedrucktes
     {t:'list',    ordered, items:[...]}    — Liste
     {t:'anatomy', tokens:[{k,glyph,cap}]}  — ein Befehl in seine Teile zerlegt
     {t:'diagram', label, svg, caption}     — Flussdiagramm
     {t:'legend',  items:[{chip,text}]}     — Legende der Formen
     {t:'sb',      title, code, night}      — Sandkasten mit echtem Python
     {t:'task',    id, kind, goal, code,
                   hints, solution, checks} — Aufgabe; kind:'fix' = Schild „Repariere“
     {t:'applied', title, html}             — Aufgabe „Im Leben“
     {t:'gist',    html}                    — „Kurz gesagt“: der Gedanke in einem Satz
     {t:'word',    term, html}              — ein Wort am Rand (Docht, Linse, Kanister …)
     {t:'bridge',  pairs:[[unseres,ihres,Note]]} — die Brücke zum echten Python
     {t:'debug',   steps:[...], html}       — Karte „Wenn es nicht läuft“
     {t:'secret',  title, p:[...]}          — geheime Seite
     {t:'progress'}                         — Logbuch der Aufgaben
     {t:'cta',     href, text}              — Knopf am Ende
   ========================================================================== */

window.BOOK = {
  title: `Max und der Code des Leuchtturms`,
  footer: `Max, Tsugi und Zerberus · das Licht des Leuchtturms`,
  chapters: []
};

/* ===================== FÜR ERWACHSENE ===================== */
window.BOOK.chapters.push({
  id: `dlia-doroslogo`,
  num: `Für Erwachsene`,
  title: `Was dieses Buch wirklich beibringt`,
  blocks: [
    { t:`story`, p:[
      `Das ist die einzige Seite im Buch, die nicht mit Max’ Stimme und nicht für das Kind
       geschrieben ist. Sie kostet drei Minuten, und danach muss man nie wieder hierher zurück.`,
      `Ganz kurz gesagt: Python ist hier nur der Anlass. Das Buch bringt bei, in Schritten zu denken.`,
    ]},

    { t:`pull`, html:`Die Sprache, in der dieses Buch geschrieben ist, kann in zehn Jahren veraltet
      sein. Die Gewohnheit, Großes in Schritte zu zerlegen, nicht.` },

    { t:`journal`, title:`Was drinsteckt, wenn man den Code wegnimmt`, blocks:[
      { t:`p`, html:`Das Python in diesem Buch ist echt: das Kind schreibt Code, und der läuft
        wirklich — kein Zeichentrickfilm, keine Nachahmung. Aber wenn man aus dem Buch allen Code
        entfernte, bliebe das Wichtigste übrig —
        <strong>eine Art, etwas anzupacken, das zu groß ist, um es auf einmal anzupacken</strong>.
        Erwachsene nennen das algorithmisches Denken. In Wahrheit sind es fünf Gewohnheiten,
        und jedes Kapitel setzt eine davon:` },
      { t:`list`, ordered:true, items:[
        `<strong>Großes in Schritte zerlegen.</strong> Nicht „den Leuchtturm anzünden“, sondern
         vier Taten in einer bestimmten Reihenfolge. Nicht „das Zimmer aufräumen“, sondern
         zuerst die Bücher, dann die Kleidung.
         <span class="small">(Kapitel 1)</span>`,
        `<strong>Etwas benennen, um es nicht im Kopf behalten zu müssen.</strong> Eine Zahl, an die
         man jeden Abend denken muss, wohnt nicht im Gedächtnis, sondern in einem Glas mit
         Aufschrift. Was einen Namen hat, kostet keine Kraft mehr.
         <span class="small">(Kapitel 2 und 5)</span>`,
        `<strong>Das Muster sehen und eine Regel statt einer Liste schreiben.</strong>
         Nicht „dreh den Strahl sechzigmal“, sondern „solange es dunkel ist — leuchte“.
         <span class="small">(Kapitel 3)</span>`,
        `<strong>Vor der Wahl innehalten und die Zweige durchgehen.</strong> Zwischen dem, was
         passiert ist, und dem, was du tust, liegt eine Pause. In ihr wohnt die Wahl.
         <span class="small">(Kapitel 4)</span>`,
        `<strong>Wenn es nicht läuft — lesen, die Zeile finden, eine Sache ändern.</strong>
         Nicht alles neu schreiben. Das ist die durchgehende Gewohnheit, sie wiederholt sich
         in jedem Kapitel.`,
      ]},
      { t:`p`, html:`Keine dieser fünf Gewohnheiten handelt von Computern.` },
    ]},

    { t:`journal`, title:`Warum das wichtiger ist als die Sprache selbst`, blocks:[
      { t:`p`, html:`Das Kind wird höchstwahrscheinlich nicht Programmierer — und das ist auch nicht
        das Ziel des Buches. Das Ziel ist einfacher und nützlicher: dass man Großes und Bedrohliches
        Stück für Stück in die Hand nehmen kann. Das funktioniert bei einer Klassenarbeit, bei einem
        Umzug, bei einem Streit und beim ersten Job genauso wie bei einem Leuchtturm.` },
      { t:`p`, html:`Genau deshalb steht am Ende jedes Kapitels eine Aufgabe <strong>„Im Leben“</strong> —
        dort kommt keine einzige Zeile Code vor. Das ist keine Beigabe zum Buch, das ist das Buch.
        Wenn das Kind nach sechs Abenden das Wort <code>while</code> vergessen hat, aber eine Sekunde
        innehält, bevor es antwortet — dann hat das Buch gewirkt.` },
      { t:`p`, html:`Und noch etwas, worüber selten gesprochen wird. Der Computer ist wohl der
        einzige Gesprächspartner, der einen für einen Fehler nie beschämt. Er seufzt nicht,
        vergleicht nicht mit anderen und erinnert sich nicht daran, dass gestern schon einmal
        gefragt wurde. Er sagt einfach, was genau er nicht verstanden hat — und wartet, so lange
        es dauert. Ein Kind, das sich hundertmal geirrt und hundertmal neu versucht hat, nimmt
        daraus nicht Python mit. Es nimmt mit, dass ein Fehler kein Urteil ist,
        sondern eine Nachricht.` },
    ]},

    { t:`journal`, title:`Wie man das liest`, blocks:[
      { t:`list`, items:[
        `<strong>Ein Kapitel — ein Abend.</strong> Es sind sechs. Nicht am Stück: nach jedem Kapitel
         soll sich ein neuer Gedanke setzen, nicht fünf.`,
        `<strong>Die Hinweise und das „ins Logbuch des Wärters spicken“ gehören zum Buch</strong>,
         sie sind kein Schleichweg. Spicken, verstehen und dann selbst wiederholen ist eine ganz
         normale Art zu lernen. Scham schadet hier mehr als Nichtwissen.`,
        `<strong>Tippen Sie nicht für das Kind.</strong> Auch wenn es schneller ginge. Vor allem dann.`,
        `<strong>Wenn es feststeckt, sagen Sie nicht, wo der Fehler ist.</strong> Fragen Sie:
         „Und was hat der Leuchtturm gesagt?“ Im Buch stehen vier Schritte für diesen Fall;
         Ihre Rolle ist, daran zu erinnern — nicht, sie an seiner Stelle zu gehen.`,
        `<strong>Lassen Sie kaputtmachen.</strong> Das Buch bittet stellenweise ausdrücklich darum,
         absichtlich einen Fehler zu machen — eine Zeile zu löschen und zu schauen, was passiert.
         Das ist kein Scherz und kein Versehen: einen Fehler, den man mit Absicht gemacht hat,
         erkennt man später auf den ersten Blick.`,
        `<strong>Die Frage beim Abendessen</strong>, die mehr wert ist als jede Aufgabe:
         „Und wo hätte man es heute noch genauso machen können?“`,
      ]},
    ]},

    { t:`journal`, title:`Was man nicht erwarten sollte`, blocks:[
      { t:`p`, html:`Nach sechs Abenden wird das Kind nicht „programmieren können“ — das sei ehrlich
        gesagt. Es wird etwas anderes können: eine Aufgabe in Schritten erklären, Wiederholungen
        bemerken, den Dingen Namen geben und nicht in Panik geraten, wenn etwas nicht läuft.
        Und wenn es später ein Erwachsenenbuch über Python aufschlägt, erkennt es dort die Hälfte
        der Wörter wieder: am Ende jedes Kapitels steht eine Seite
        „Wie das in der großen Welt heißt“, auf der die Befehle des Leuchtturms in echtes
        <code>while</code>, <code>if</code>, <code>def</code>, <code>return</code> übersetzt sind.` },
    ]},

    { t:`journal`, title:`Das Technische, in einer Minute`, blocks:[
      { t:`list`, items:[
        `Läuft direkt im Browser. Es muss nichts installiert werden.`,
        `Beim ersten Start des Codes wird Python aus dem Internet nachgeladen — ein paar Sekunden, einmal.`,
        `Keine Konten, keine Anmeldung, keine Datensammlung. Es wird nichts irgendwohin geschickt.`,
        `Die Sterne für die Aufgaben liegen im Speicher des Browsers selbst. Im Epilog gibt es die
         Knöpfe <strong>Logbuch als Datei sichern</strong> und <strong>aus Datei zurückholen</strong> —
         für den Fall eines geleerten Browsers oder eines anderen Computers.`,
        `Das Buch gibt es auf Deutsch und auf Ukrainisch; oben rechts lässt sich die Sprache
         umschalten. Die Befehle wechseln mit — auf Deutsch schreibt das Kind
         <code>feuer_anzünden()</code>, auf Ukrainisch <code>запалити_вогонь()</code>.
         Die Sterne bleiben in beiden Sprachen dieselben.`,
        `Alter: etwa <strong>9–12</strong>. Jüngeren Kindern zusammen mit Ihnen;
         älteren ganz allein.`,
      ]},
    ]},

    { t:`pull`, html:`Und zuletzt. Wenn Sie sich danebensetzen und sich erlauben, die Antwort nicht
      zu wissen, wirkt das Buch doppelt so gut. Max hat auch niemand vorgesagt.` },
  ]
});

/* ===================== VON MAX ===================== */
window.BOOK.chapters.push({
  id: `vid-maksa`,
  num: `Von Max`,
  title: `Das hier ist mein Logbuch`,
  blocks: [
    { t:`story`, p:[
      `Ich heiße Max. Mir hat man einen Leuchtturm dagelassen.`,
      `Ich wusste nicht, wie man ihn bedient. Ehrlich — am ersten Abend stand ich oben, hielt den
       Schlüssel in der Hand und dachte, gleich mache ich alles kaputt. Also fing ich an
       aufzuschreiben: was ich verstanden hatte, wo ich mich geirrt hatte, was geholfen hatte.
       Erst nur, um es nicht zu vergessen.`,
      `Und dann dachte ich: Vielleicht gibt man irgendwann noch jemandem einen Leuchtturm — und
       der steht dann auch so da, mit dem Schlüssel in der Hand, und weiß nicht, wo er anfangen
       soll. Also soll dieses Logbuch auch für ihn sein.`,
    ]},
    { t:`pull`, html:`Das ist kein Lehrbuch. Das ist ein Logbuch. Lies es so, als säßen wir
      nebeneinander im Laternenzimmer — und ich zeige mit dem Finger: schau, hier versteckt es sich.` },
    { t:`journal`, title:`Wie die Aufgaben hier gebaut sind`, blocks:[
      { t:`p`, html:`In jedem Kapitel gibt es außer der Geschichte auch <strong>Aufgaben</strong> —
        Stellen, an denen der Code schon von dir kommt und nicht mehr von mir. Dort steht ein leerer
        oder fast leerer Sandkasten und ein Ziel: was genau mit dem Leuchtturm passieren soll.` },
      { t:`list`, items:[
        `Du willst nicht jeden Buchstaben tippen? Über dem Sandkasten sind
         <strong>Knöpfe mit Befehlen</strong>. Draufdrücken, und die Zeile steht da — mit Klammern
         und Einrückung.`,
        `Drück „Starten“ — und der Leuchtturm tut genau das, was dasteht.`,
        `Unten erscheint die <strong>Antwort des Leuchtturms</strong>: geschafft — oder was noch
         nicht stimmt.`,
        `Wenn es hakt, klapp den <em>Hinweis</em> auf. Es gibt zwei bis drei davon, und sie
         verderben nichts.`,
        `Wenn gar nichts mehr geht, gibt es <em>„ins Logbuch des Wärters spicken“</em>: da steht
         meine Lösung. Spicken ist nicht peinlich. Peinlich ist, es nicht zu versuchen.`,
        `Wenn es geklappt hat, bekommt die Aufgabe einen Stern ★, und das Buch merkt ihn sich.`
      ]},
      { t:`small`, html:`Es gibt auch Aufgaben mit dem Schild <strong>„Repariere“</strong>. Dort ist
        der Code schon geschrieben — nur kaputt. Das ist mein Code. Ich habe mich wirklich so geirrt.` },
      { t:`small`, html:`Ganz am Ende, im Epilog, steht das <strong>Logbuch der Aufgaben</strong> —
        dort sieht man alles, was schon geschafft ist, und das, wozu man zurückkehren kann.` }
    ]},

    { t:`debug`, steps:[
      `<strong>Lies, was der Leuchtturm gesagt hat.</strong> Schreib nicht alles neu. Lies erst —
       da steht fast immer, was fehlt.`,
      `<strong>Finde die Zeile.</strong> Eine. Die, von der der Leuchtturm spricht.`,
      `<strong>Ändere eine Sache.</strong> Genau eine. Nicht drei.`,
      `<strong>Starte noch einmal.</strong> Und schau, ob die Antwort des Leuchtturms anders geworden ist.`
    ], html:`Das ist alles. Vier Schritte, keine Magie. Ich mache das bis heute so — jedes Mal,
      wenn etwas nicht läuft. Ein Fehler heißt nicht, dass mit dir etwas nicht stimmt. Er heißt,
      dass der Leuchtturm etwas nicht verstanden hat und dir gleich sagt, was genau.` },

    { t:`story`, p:[
      `Und noch eins. Hier darfst du dich so oft irren, wie du willst.`,
      `Im Buch gibt es Sandkästen — Stellen, an denen du echten Code schreibst und mein Leuchtturm
       genau auf dich hört. Wenn etwas schiefgeht, zerbricht er nicht und wird nicht böse.
       Er sagt einfach, dass er es nicht verstanden hat. Wie Tsugi.`,
    ]},
  ]
});

/* ===================== PROLOG ===================== */
window.BOOK.chapters.push({
  id: `prolog`,
  num: `Prolog`,
  title: `Tsugi ist abgereist`,
  blocks: [
    { t:`story`, p:[
      `Tsugi fuhr zu einem Freund. Bis nach Japan — dorthin, wo man zerbrochene Tassen mit Gold
       zusammenklebt, so wie man einmal ihn selbst zusammengeklebt hatte. Er schaute lange aus dem
       Koffer zu Max herüber, als wollte er etwas sagen, und blinzelte dann einfach langsam,
       so wie es nur er konnte.`,
      `— Ich bin nicht lange weg, sagte Tsugi. — Und der Leuchtturm liegt jetzt bei dir.`,
      `So blieb Max allein. Zum ersten Mal — allein mit seinem Leuchtturm auf einem ganzen Hügel
       voller Sonnenblumen. Am Abend musste das Licht an, und plötzlich merkte er, dass er nicht
       richtig wusste, wie. Er stieg die Wendeltreppe hinauf ins Laternenzimmer —
       siebenundachtzig Stufen, an diesem Abend zählte er sie zum ersten Mal. Der Schlüssel hing da,
       wo er immer hing.`,
      `Und auf dem Tisch lag das alte Logbuch des Wärters. So, als hätte es jemand vor langer Zeit
       genau für den zurückgelassen, der endlich allein hier heraufkommt. Die Seiten rochen nach
       Petroleum und nach Meer.`,
      `Auf der Fensterbank daneben standen zwei Gläser. Die Sonne war fast untergegangen und schien
       hindurch wie durch Honig.`,
      `Neben dem Logbuch stand ein kleiner Kasten mit einem leisen Lichtchen darin — ein kleiner
       Computer, der, wie sich herausstellte, die ganze Zeit den schweren Strahl gedreht hatte.
       Und auch er hatte sein eigenes Logbuch. Nur musste man darin mit besonderen Wörtern schreiben.`,
      `Max setzte sich neben den Kasten auf den Boden, zog die Knie an und hörte zu, wie unten das
       Feld rauschte. Er hatte Angst. Aber die Neugier war ein bisschen größer als die Angst.
       Genau an diesem „ein bisschen größer“ hing danach alles Weitere.`,
    ]},
    { t:`word`, term:`Wärter`, html:`der Mensch, der beim Leuchtturm wohnte und ihn jeden Abend
      anzündete. Einer für die ganze Küste. Vor Max gab es hier genau so einen.` },
    { t:`pull`, html:`Dieses Buch ist genau dieses Logbuch. Lies es zusammen mit Max. Und wenn du
      einen Sandkasten siehst, versuch selbst hineinzuschreiben. Irren darfst du dich, so viel du
      willst: auch der Strahl des Leuchtturms ist früher manchmal ausgegangen.` },
  ]
});

/* ===================== KAPITEL 1 ===================== */
window.BOOK.chapters.push({
  id: `rozdil1`,
  num: `Kapitel 1`,
  title: `Die Liste, Schritt für Schritt`,
  blocks: [
    { t:`postcard`, from:`🐈 Postkarte von Tsugi · Kyoto`, stamp:`🌸`, p:[
      `„Hier repariert ein Meister den ganzen Tag lang eine einzige Tasse. Er hat es nicht eilig.
       Er sagt: erst der Reihe nach, und dann das Gold. Die Reihenfolge, Max. Alles fängt mit der
       Reihenfolge an.“`
    ]},
    { t:`story`, p:[
      `Max dachte, den Leuchtturm anzuzünden sei einfach. Streichholz anreißen — und leuchten.
       Er griff schon nach dem Feuer, als ihm das Logbuch einfiel und er beschloss, sicherheitshalber
       hineinzuschauen.`,
      `Im Logbuch stand nicht eine Zeile. Da stand eine Liste:`
    ]},
    { t:`journal`, title:`Aus dem alten Logbuch des Wärters`, blocks:[
      { t:`list`, ordered:true, items:[
        `das Glas putzen`,
        `den Docht richten`,
        `die Linse nach Norden drehen`,
        `das Feuer anzünden`
      ]},
      { t:`small`, html:`Unten auf der Seite steht, mit anderer Tinte:
        <em>„nicht vertauschen. ich habe vertauscht.“</em>` }
    ]},
    { t:`word`, term:`Docht`, html:`ein dicker Faden in der Lampe. Er saugt das Petroleum auf und
      brennt. Ist der Docht schief, qualmt das Feuer und rußt.` },
    { t:`word`, term:`Linse`, html:`ein großes Glas, das das Licht zu einem dicken Strahl bündelt.
      Wohin du die Linse drehst, dorthin leuchtet der Leuchtturm.` },
    { t:`story`, p:[
      `Max hat natürlich vertauscht. Er zündete das Feuer zuerst an — das ist ja die Hauptsache,
       dachte er, den Rest mache ich später.`,
      `Das Feuer flammte auf, der Strahl ging hinaus ins Feld … und erlosch nach einer Minute.
       Das Glas war schwarz vom Ruß, und das Licht fand einfach nicht hinaus.`,
      `Er putzte das Glas und fing von vorn an — der Reihe nach. Und der Leuchtturm leuchtete.
       Da dachte Max zum ersten Mal, woran er sich später noch oft erinnerte: Der Computer ist
       nicht klüger als du. Er tut einfach genau das, was man ihm sagt, und genau in der
       Reihenfolge, in der man es sagt.`
    ]},
    { t:`journal`, title:`Zerlegen wir einen Befehl`, blocks:[
      { t:`p`, html:`Der kleinste Befehl ist, als bittest du jemanden, etwas zu <em>tun</em>.
        Er besteht aus zwei Teilen:` },
      { t:`anatomy`, tokens:[
        { k:`fn`,   glyph:`glas_putzen`, cap:`Name der Tat — was zu tun ist` },
        { k:`punc`, glyph:`()`,          cap:`Klammern — „tu es jetzt“` }
      ]},
      { t:`small`, html:`Der Name sagt, <em>was</em> zu tun ist. Die Klammern sagen
        <em>tu es sofort</em>.` },
      { t:`p`, html:`Ein Name ohne Klammern ist, als zeigtest du mit dem Finger auf eine Sache und
        tätest nichts. <code>glas_putzen</code> — „so eine Tat gibt es“.
        <code>glas_putzen()</code> — „tu sie“.` },
      { t:`gist`, html:`der Name sagt <em>was</em>. Die Klammern sagen <em>jetzt</em>.
        Ohne Klammern passiert gar nichts.` }
    ]},
    { t:`small`, html:`Schreib irgendwann mal einen Namen ohne Klammern und starte. Der Leuchtturm
      bleibt stumm — aber Zerberus merkt es und sagt dir, was fehlt. Er merkt es immer.` },
    { t:`h3`, text:`Was ein Flussdiagramm ist` },
    { t:`p`, html:`Denselben Gedanken kann man auch malen statt schreiben. So eine Zeichnung heißt
      <strong>Flussdiagramm</strong>. Ihre Formen:` },
    { t:`journal`, blocks:[
      { t:`legend`, items:[
        { chip:`<svg class="chip" viewBox="0 0 40 24"><rect x="1" y="4" width="38" height="16" rx="8" fill="#ffe0ee" stroke="#b03e73"/></svg>`, text:`Oval — Anfang / Ende` },
        { chip:`<svg class="chip" viewBox="0 0 40 24"><rect x="2" y="4" width="36" height="16" rx="3" fill="#d4f5ef" stroke="#1c7a6e"/></svg>`, text:`Rechteck — eine Tat` },
        { chip:`<svg class="chip" viewBox="0 0 40 24"><polygon points="20,3 37,12 20,21 3,12" fill="#fff2cf" stroke="#a5741a"/></svg>`, text:`Raute — eine Frage` },
        { chip:`<svg class="chip" viewBox="0 0 40 24"><line x1="6" y1="12" x2="30" y2="12" stroke="#5b567e" stroke-width="2"/><polygon points="30,6 40,12 30,18" fill="#5b567e"/></svg>`, text:`Pfeil — wohin weiter` }
      ]},
      { t:`diagram`, label:`Diagramm: Anfang, vier Taten nacheinander, Ende`, svg:`
        <svg viewBox="0 0 240 300" width="240" role="img" aria-label="Diagramm: Anfang, vier Taten nacheinander, Ende">
          <defs><marker id="ar" markerWidth="9" markerHeight="9" refX="6" refY="4.5" orient="auto"><polygon points="0,0 9,4.5 0,9" fill="#5b567e"/></marker></defs>
          <g font-family="Nunito" font-size="12" text-anchor="middle" fill="#2b2748">
            <rect x="70" y="6" width="100" height="30" rx="15" fill="#ffe0ee" stroke="#b03e73"/><text x="120" y="25">Anfang</text>
            <line x1="120" y1="36" x2="120" y2="52" stroke="#5b567e" stroke-width="2" marker-end="url(#ar)"/>
            <rect x="55" y="54" width="130" height="30" rx="4" fill="#d4f5ef" stroke="#1c7a6e"/><text x="120" y="73">Glas putzen</text>
            <line x1="120" y1="84" x2="120" y2="100" stroke="#5b567e" stroke-width="2" marker-end="url(#ar)"/>
            <rect x="55" y="102" width="130" height="30" rx="4" fill="#d4f5ef" stroke="#1c7a6e"/><text x="120" y="121">Docht richten</text>
            <line x1="120" y1="132" x2="120" y2="148" stroke="#5b567e" stroke-width="2" marker-end="url(#ar)"/>
            <rect x="55" y="150" width="130" height="30" rx="4" fill="#d4f5ef" stroke="#1c7a6e"/><text x="120" y="169">Linse drehen</text>
            <line x1="120" y1="180" x2="120" y2="196" stroke="#5b567e" stroke-width="2" marker-end="url(#ar)"/>
            <rect x="55" y="198" width="130" height="30" rx="4" fill="#d4f5ef" stroke="#1c7a6e"/><text x="120" y="217">Feuer anzünden</text>
            <line x1="120" y1="228" x2="120" y2="244" stroke="#5b567e" stroke-width="2" marker-end="url(#ar)"/>
            <rect x="70" y="246" width="100" height="30" rx="15" fill="#ffe0ee" stroke="#b03e73"/><text x="120" y="265">Turm leuchtet</text>
          </g>
        </svg>`, caption:`Das Diagramm liest man von oben nach unten — genau so, wie der Computer den Code liest.` }
    ]},
    { t:`story`, p:[
      `Probier es selbst. Starte die Liste — und schau rechts auf den Leuchtturm. Und dann vertausch
       die Zeilen absichtlich, so wie Max es getan hat, und schau, was dabei herauskommt.`
    ]},
    { t:`sb`, title:`Die erste Nacht — zünde den Leuchtturm an`, ticks:6, fuel:12, code:
`glas_putzen()
docht_richten()
linse_drehen("norden")
feuer_anzünden()` },
    { t:`max`, p:[
      `Ich dachte, die Hauptsache sei das Feuer und der Rest Kleinkram. Es war umgekehrt: das Feuer
       ist der letzte Schritt, und alles hängt an den drei langweiligen, die niemand sieht.`
    ]},
    { t:`task`, id:`t1-1`, title:`Zünde den Leuchtturm selbst an`,
      goal:`Der Sandkasten ist leer — jetzt bist du der Wärter. Schreib die vier Schritte aus dem
            Logbuch der Reihe nach auf, damit der Leuchtturm angeht. Dreh die Linse nach
            <code>"norden"</code>.`,
      sbTitle:`Deine erste Nacht`, ticks:6, fuel:12,
      code:`# deine vier Schritte:\n`,
      hints:[
        `Jeder Schritt ist der Name einer Tat und Klammern: <code>glas_putzen()</code>.`,
        `Die Reihenfolge ist dieselbe wie im Logbuch: Glas → Docht → Linse → Feuer.`
      ],
      solution:`glas_putzen()
docht_richten()
linse_drehen("norden")
feuer_anzünden()`,
      checks:[{r:`order`, steps:[`clean`,`trim`,`lens`,`ignite`]}, {r:`lens`, to:`norden`}, {r:`lit`}] },

    { t:`task`, id:`t1-2`, title:`Gast auf dem Pfad`,
      goal:`Auf dem Pfad kommt jemand zum Leuchtturm herauf, und genau dorthin wird das Licht
            gebraucht. Mach dieselben Schritte, aber dreh die Linse nach <code>"pfad"</code> —
            und gib kein gewöhnliches Feuer, sondern volles Licht.`,
      sbTitle:`Licht auf den Pfad`, ticks:6,
      code:`glas_putzen()\n# weiter — deine Sache\n`,
      hints:[
        `Volles Licht ist der Befehl <code>volles_licht()</code>.`,
        `Die Schritte sind dieselben wie vorhin: Glas → Docht → Linse → Licht. Nur die letzten
         beiden haben sich geändert.`
      ],
      solution:`glas_putzen()
docht_richten()
linse_drehen("pfad")
volles_licht()`,
      checks:[{r:`order`, steps:[`clean`,`trim`,`lens`,`full`]}, {r:`lens`, to:`pfad`}] },

    { t:`task`, id:`t1-3`, kind:`fix`, title:`Was stimmt hier nicht?`,
      goal:`Max hat die Liste in den Kasten geschrieben — und der Leuchtturm ging nicht an.
            Der Code ist fast richtig. Finde heraus, wo genau er gestolpert ist, und repariere es.`,
      sbTitle:`Repariere den ersten Abend`, ticks:6, fuel:12,
      code:`glas_putzen()\ndocht_richten\nlinse_drehen("norden")\nfeuer_anzünden()\n`,
      hints:[
        `Starte zuerst und lies, was der Leuchtturm sagt. Dann schau dir die zweite Zeile an und
         alle anderen.`,
        `Wodurch unterscheidet sich die zweite Zeile von den übrigen? Vergleich ihr Ende.`
      ],
      solution:`glas_putzen()
docht_richten()
linse_drehen("norden")
feuer_anzünden()`,
      checks:[{r:`order`, steps:[`clean`,`trim`,`lens`,`ignite`]}, {r:`lit`}] },

    { t:`bridge`, pairs:[
      [`Befehl des Leuchtturms`, `Funktion`, `eine Tat, die einen Namen hat`],
      [`Klammern nach dem Namen`, `Aufruf`, `„tu das jetzt“`],
      [`zeigen(…)`, `print(…)`, `etwas ins Logbuch schreiben`]
    ], html:`In diesem Buch sind die Befehle deutsch, damit man den Sinn sieht. In der großen Welt
      sind sie englisch — aber ganz genau gleich gebaut: Name, Klammern, und in den Klammern das,
      was man mitgeben will.` },

    { t:`applied`, id:`life-1`, title:`Ein zu großes Zimmer.`, html:`Wenn dir etwas zu groß vorkommt,
      um es anzupacken, zerleg es in Schritte wie die Liste des Leuchtturms. Nicht „das Zimmer
      aufräumen“, sondern: erst die Bücher, dann die Kleidung, dann die Zettel. Schreib dir diese
      Woche für etwas Großes deine eigene Liste aus 3–4 Schritten.` }
  ]
});

/* ===================== KAPITEL 2 ===================== */
window.BOOK.chapters.push({
  id: `rozdil2`,
  num: `Kapitel 2`,
  title: `Die Gläser mit den Kernen`,
  blocks: [
    { t:`postcard`, from:`🐈 Postkarte von Tsugi · Nara`, stamp:`🦌`, p:[
      `„Ich füttere Hirsche. Ein Keks aus dem Beutel — und im Beutel wird es weniger, aber der
       Beutel bleibt derselbe. Seltsam, wie vieles im Leben so ein Beutel ist.“`
    ]},
    { t:`story`, p:[
      `Am Morgen wachte Max oben auf, einfach auf der Bank neben der Laterne, und das Erste, was er
       sah, waren die Gläser. Zwei Gläser auf der Fensterbank des Laternenzimmers, nebeneinander,
       Schulter an Schulter. Auf jedem ein Zettel, mit der Hand des Wärters beschriftet:
       <em>vorrat</em> und <em>nacht</em>.`,
      `Im „vorrat“ lagen jede Menge Sonnenblumenkerne. Und „nacht“ stand leer da — kein einziger Kern
       auf dem Boden. Max drehte das Glas in den Händen, hielt es gegen die Sonne und verstand gar
       nichts: Wozu sollte jemand die Nacht zählen, wenn draußen Morgen ist? Er stellte es zurück,
       genau an dieselbe Stelle. (Verstanden hat er es erst zwei Tage später. Davon später mehr.)`,
      `Zuerst dachte Max, das seien nur irgendwelche vergessenen Mitbringsel. Aber im Logbuch fand
       sich auch über sie eine Seite.`
    ]},
    { t:`journal`, title:`Wozu ein Wärter Gläser braucht`, blocks:[
      { t:`p`, html:`Der Wärter trug das Logbuch nicht mit sich herum. Nach oben sind es
        siebenundachtzig Stufen. Unten Meer und Nebel: Papier wird feucht, der Bleistift verschwindet
        zwischen den Dielen. Und Sonnenblumenkerne hat man auf einem Sonnenblumenhügel immer
        taschenweise dabei.` },
      { t:`p`, html:`Deshalb behielt er jede Zahl, an die er jede Nacht denken musste, nicht im Kopf
        und nicht auf Papier, sondern <strong>in einem Glas</strong>. So viele Kerne, so viele Nächte.
        Einen Kanister ausgegossen — einen Kern herausgenommen. Einen neuen bekommen — nachgefüllt.` },
      { t:`p`, html:`Und die Gläser standen genau hier oben, direkt unter der Laterne — damit der,
        der heraufsteigt, im Licht der Lampe sofort sieht, wie viel von was noch da ist. Nicht suchen,
        nicht blättern, nicht nachdenken. Hochgestiegen — und schon weißt du es.` },
      { t:`small`, html:`Kerne kann man nachfüllen und herausnehmen. Ein Glas kann leer werden, es kann
        randvoll werden. Aber <strong>die Aufschrift darauf bleibt dieselbe</strong> — und genau darin
        liegt der ganze Trick.` }
    ]},
    { t:`story`, p:[
      `Max schüttete das Glas „vorrat“ in die Hand und zählte: zwölf Kerne. Zwölf Nächte Brennstoff.
       Das reichte, um keine Angst zu haben, und reichte nicht, um es zu vergessen.`,
      `Und dann tat er etwas, was der Wärter nie getan hatte: Er stellte ein eigenes, drittes Glas auf.`
    ]},
    { t:`h3`, text:`Das Glas, das Max aufstellte` },
    { t:`word`, term:`Kanister`, html:`ein großes Blechgefäß mit Griff. Darin trägt man den Brennstoff —
      das Petroleum, mit dem die Lampe des Leuchtturms brennt.` },
    { t:`story`, p:[
      `Der Brennstoff für die Lampe stand unten, im Lager unter der Treppe — schwere Blechkanister
       mit Petroleum. Ein Kanister reichte der Lampe genau für vier Nächte. Max hat das zweimal
       nachgeprüft, weil er es beim ersten Mal nicht glaubte.`,
      `Die Mühe lag woanders. Um zu wissen, wie viele Kanister noch übrig waren, musste man
       siebenundachtzig Stufen hinunter, mit der Taschenlampe in die Ecke leuchten — und wieder
       hinauf. An einem Abend machte Max das zweimal, setzte sich auf eine Stufe und sagte laut:
       „Nein. So will ich das nicht.“`,
      `Er suchte ein leeres Glas, schrieb <em>kanister</em> darauf und stellte es zu den anderen,
       auf dieselbe Fensterbank. So viele Kanister im Lager, so viele Kerne im Glas. Gießt du einen
       in die Lampe — nimm einen Kern aus „kanister“ heraus und füll vier in „vorrat“ nach.
       Vier neue Nächte.`,
      `Zerberus, der an diesem Abend schon an der Tür lag, schaute das neue Glas so an, als hätte
       er immer schon von ihm gewusst.`,
      `Jetzt musste niemand mehr hinunterlaufen: hoch zur Laterne — und mit einem Blick weißt du
       alles, was du über diesen Abend wissen musst. Wie viele Nächte noch in der Lampe sind.
       Wie viele Kanister im Lager warten. Und ob du es noch nach neuen schaffst, solange das
       Wetter ruhig ist.`
    ]},
    { t:`pull`, html:`Ein Glas weiß nicht, was es zählt. Es hat keinen Gedanken — nur eine Aufschrift
      und das, was drin ist. Darum kann man damit Nächte zählen, Kanister, Schritte oder Hirschkekse.` },
    { t:`journal`, title:`Zerlegen wir den Eintrag ins Glas`, blocks:[
      { t:`p`, html:`In dem Kasten mit dem Lichtchen gibt es Gläser auch. Nur statt Glas eine Zeile:` },
      { t:`anatomy`, tokens:[
        { k:`fn`,   glyph:`vorrat`, cap:`Name des Glases (die Aufschrift)` },
        { k:`punc`, glyph:` = `,    cap:`„leg das hier hinein“` },
        { k:`num`,  glyph:`12`,     cap:`was wir hineinlegen` }
      ]},
      { t:`small`, html:`Das Zeichen <code>=</code> heißt hier nicht „ist gleich“. Es heißt
        <strong>„leg das Rechte ins Linke“</strong>.` },
      { t:`h3`, text:`Und jetzt die seltsamste Zeile des ganzen Buches` },
      { t:`anatomy`, tokens:[
        { k:`fn`,   glyph:`kanister`, cap:`wohin legen` },
        { k:`punc`, glyph:` = `,      cap:`„leg das hier hinein“` },
        { k:`fn`,   glyph:`kanister`, cap:`wie viele es waren` },
        { k:`punc`, glyph:` - `,      cap:`herausnehmen` },
        { k:`num`,  glyph:`1`,        cap:`einen in die Lampe gegossen` }
      ]},
      { t:`p`, html:`Sieht aus wie ein Rätsel: Kanister ist gleich Kanister minus einer? So etwas gibt
        es doch nicht. Aber hier steht auch gar kein „ist gleich“. Zuerst wird die
        <strong>rechte</strong> Seite ausgerechnet — wir nehmen, wie viele im Glas waren, und ziehen
        einen ab. Und erst dann legen wir das Ergebnis zurück ins Glas mit derselben Aufschrift.` },
      { t:`small`, html:`Erst rechnen. Dann hineinlegen. Immer in dieser Reihenfolge.` },
      { t:`diagram`, label:`Diagramm: das Glas „kanister“ nach der Zeile kanister = kanister - 1`, svg:`
        <svg viewBox="0 0 330 200" width="330" role="img" aria-label="Diagramm: wie sich das Glas kanister ändert">
          <defs><marker id="ar2b" markerWidth="9" markerHeight="9" refX="6" refY="4.5" orient="auto"><polygon points="0,0 9,4.5 0,9" fill="#5b567e"/></marker></defs>
          <g font-family="Nunito" font-size="11" text-anchor="middle" fill="#2b2748">
            <path d="M18 44 h64 v82 a8 8 0 0 1 -8 8 h-48 a8 8 0 0 1 -8 -8 z" fill="#fff8e6" stroke="#a5741a"/>
            <rect x="14" y="36" width="72" height="10" rx="3" fill="#e9dcbb" stroke="#a5741a"/>
            <text x="50" y="26" font-size="11">kanister</text>
            <circle cx="36" cy="112" r="5" fill="#5b4a2a"/><circle cx="50" cy="118" r="5" fill="#5b4a2a"/><circle cx="64" cy="112" r="5" fill="#5b4a2a"/>
            <text x="50" y="152" font-size="12" font-weight="700">waren 3</text>

            <line x1="92" y1="96" x2="126" y2="96" stroke="#5b567e" stroke-width="2" marker-end="url(#ar2b)"/>
            <rect x="128" y="62" width="76" height="68" rx="6" fill="#d4f5ef" stroke="#1c7a6e"/>
            <text x="166" y="86">1. rechne</text><text x="166" y="104" font-size="12" font-weight="700">3 - 1 = 2</text>
            <text x="166" y="122" font-size="10" fill="#1c7a6e">die rechte Seite</text>
            <line x1="204" y1="96" x2="238" y2="96" stroke="#5b567e" stroke-width="2" marker-end="url(#ar2b)"/>
            <text x="221" y="86" font-size="10" fill="#5b567e">2. leg hin</text>

            <path d="M244 44 h64 v82 a8 8 0 0 1 -8 8 h-48 a8 8 0 0 1 -8 -8 z" fill="#fff8e6" stroke="#a5741a"/>
            <rect x="240" y="36" width="72" height="10" rx="3" fill="#e9dcbb" stroke="#a5741a"/>
            <text x="276" y="26" font-size="11">kanister</text>
            <circle cx="266" cy="116" r="5" fill="#5b4a2a"/><circle cx="286" cy="116" r="5" fill="#5b4a2a"/>
            <text x="276" y="152" font-size="12" font-weight="700">sind 2</text>
            <text x="165" y="184" font-size="10.5" fill="#5b567e">die Aufschrift bleibt — nur der Inhalt ändert sich</text>
          </g>
        </svg>`, caption:`Ein Glas, eine Zeile, zwei Schritte: erst ausrechnen, dann zurücklegen.` },
      { t:`gist`, html:`<code>=</code> heißt nicht „ist gleich“, sondern „leg hinein“. Darum liest man
        die Zeile <code>kanister = kanister - 1</code> so: „nimm, wie viele es waren, zieh einen ab
        und leg das Ergebnis zurück“.` }
    ]},
    { t:`story`, p:[
      `Hier ist das Glas mit dem Brennstoff. Starte — und schau zu, wie ein Kern nach einer Nacht
       verschwindet.`
    ]},
    { t:`sb`, title:`Zähl den Brennstoff`, fuel:12, code:
`vorrat = 12
vorrat = vorrat - 1
zeigen(vorrat)` },
    { t:`story`, p:[
      `Und hier sind beide Gläser zusammen. Max hat gerade einen Kanister in die Lampe gegossen —
       schau, wie das eine Glas leerer und das andere davon voller wird.`
    ]},
    { t:`sb`, title:`Gieß einen Kanister nach`, fuel:12, cans:3, code:
`kanister = 3
vorrat = 12

kanister = kanister - 1     # einen in die Lampe gegossen
vorrat = vorrat + 4         # und der Turm hat vier Nächte mehr

zeigen("Kanister im Lager:", kanister)
zeigen("Nächte Licht:", vorrat)` },
    { t:`small`, html:`Versuch, noch einen nachzugießen. Und noch einen. Und wenn dann im Lager
      nichts mehr ist — nimm mehr heraus, als da ist, und schau, was das Glas anzeigt. (Ja, es gibt
      auch Minus. Dem Leuchtturm hilft das nicht, aber das Glas ist ehrlich.)` },
    { t:`max`, p:[
      `Ich war lange sicher, dass das Glas die Kerne sind. Und dann waren die Kerne im „vorrat“ alle,
       das Glas war noch da, und ich verstand: Das Glas ist nicht das, was drin ist. Das Glas ist
       ein Ort mit einer Aufschrift, von dem ich immer weiß, wo ich nachschauen muss.`
    ]},
    { t:`task`, id:`t2-1`, title:`Zwei Kanister in die Lampe`,
      goal:`Im Lager stehen drei Kanister, in der Lampe sind zwölf Nächte. Gieß zwei Kanister in die
            Lampe — einen nach dem anderen, so wie Max es gemacht hat — und zeig, wie viel von was
            übrig bleibt. Denk dran: ein Kanister sind vier Nächte.`,
      sbTitle:`Lager und Lampe`, fuel:12, cans:3,
      code:`kanister = 3\nvorrat = 12\n\n# der erste Kanister und dann der zweite\n`,
      hints:[
        `Ein Kanister sind zwei Zeilen: <code>kanister = kanister - 1</code> und
         <code>vorrat = vorrat + 4</code>.`,
        `Der zweite Kanister — dieselben zwei Zeilen noch einmal.`
      ],
      solution:`kanister = 3
vorrat = 12

kanister = kanister - 1
vorrat = vorrat + 4

kanister = kanister - 1
vorrat = vorrat + 4

zeigen("Kanister im Lager:", kanister)
zeigen("Nächte Licht:", vorrat)`,
      checks:[{r:`jar`, name:`kanister`, is:1}, {r:`jar`, name:`vorrat`, is:20}, {r:`printed`}] },

    { t:`task`, id:`t2-2`, title:`Stell dein eigenes Glas auf`,
      goal:`Auf der Fensterbank ist noch Platz. Überleg dir, was gerade du zählen willst: Holzscheite,
            Hefte, Tage bis zum Geburtstag. Schreib dieses Wort auf das Glas und leg eine Zahl hinein.
            Und dann ändere sie und zeig, was dabei herauskommt. Dein Glas erscheint neben dem
            Leuchtturm.`,
      sbTitle:`Dein Glas`,
      code:`# zum Beispiel:\n# holz = 5\n`,
      hints:[
        `Die Aufschrift ist irgendein Wort ohne Leerzeichen: <code>holz</code>, <code>hefte</code>.`,
        `Ändern heißt: erst rechts rechnen, dann hineinlegen: <code>holz = holz - 1</code>.`
      ],
      solution:`holz = 5
holz = holz - 1
zeigen("Scheite übrig:", holz)`,
      checks:[{r:`newJar`}, {r:`printed`}] },

    { t:`task`, id:`t2-3`, kind:`fix`, title:`Der Kern, der nicht ankam`,
      goal:`Max hat einen Kanister in die Lampe gegossen und es in den Kasten geschrieben. Aber das
            Glas „kanister“ ist aus irgendeinem Grund gleich geblieben. Finde die Zeile, die gerechnet —
            aber vergessen hat, das Ergebnis zurückzulegen.`,
      sbTitle:`Repariere das Glas`, fuel:12, cans:3,
      code:`kanister = 3\nvorrat = 12\n\nkanister - 1\nvorrat = vorrat + 4\n\nzeigen("Kanister:", kanister)\n`,
      hints:[
        `Starte und schau auf die Gläser neben dem Leuchtturm. Welches hat sich nicht verändert?`,
        `Rechnen allein reicht nicht. Man muss auch sagen, <em>wohin</em> das Ergebnis soll:
         <code>kanister = …</code>`
      ],
      solution:`kanister = 3
vorrat = 12

kanister = kanister - 1
vorrat = vorrat + 4

zeigen("Kanister:", kanister)`,
      checks:[{r:`jar`, name:`kanister`, is:2}, {r:`jar`, name:`vorrat`, is:16}, {r:`printed`}] },

    { t:`task`, id:`t2-4`, title:`Das leere Lager`,
      goal:`Im Lager stehen drei Kanister. Gieß alle drei in die Lampe — und zeig beide Gläser.
            In „kanister“ soll null übrig bleiben und in „vorrat“ vierundzwanzig Nächte.`,
      sbTitle:`Bis zum letzten Kanister`, fuel:12, cans:3,
      code:`kanister = 3\nvorrat = 12\n\n# drei Kanister, einer nach dem anderen\n`,
      hints:[
        `Ein Kanister sind zwei Zeilen. Drei Kanister sind dieselben zwei Zeilen dreimal.`,
        `Sag am Ende beide Gläser: <code>zeigen("Kanister:", kanister)</code> und dasselbe
         über „vorrat“.`
      ],
      solution:`kanister = 3
vorrat = 12

kanister = kanister - 1
vorrat = vorrat + 4

kanister = kanister - 1
vorrat = vorrat + 4

kanister = kanister - 1
vorrat = vorrat + 4

zeigen("Kanister:", kanister)
zeigen("Nächte:", vorrat)`,
      checks:[{r:`jar`, name:`kanister`, is:0}, {r:`jar`, name:`vorrat`, is:24}, {r:`printed`}] },

    { t:`small`, html:`Ist dir aufgefallen, dass du dieselben zwei Zeilen dreimal schreiben musstest?
      Max fand das auch lästig. Wie man das in einem Rutsch macht — im nächsten Kapitel.` },

    { t:`bridge`, pairs:[
      [`Glas`, `Variable`, `ein Ort mit Aufschrift, in den man einen Wert legt`],
      [`Aufschrift auf dem Glas`, `Name der Variablen`, `wie sie heißt`],
      [`leg hier hinein`, `=`, `Zuweisung`],
      [`zeigen(…)`, `print(…)`, `etwas ins Logbuch schreiben`]
    ], html:`Das Wort „Variable“ klingt kompliziert und meint eine einfache Sache: etwas, das man
      <em>verändern</em> kann, ohne die Aufschrift zu verändern. Also ein Glas.` },

    { t:`applied`, id:`life-2`, title:`Die Aufschrift auf dem Glas.`, html:`Solange Max an seinen Freund
      als „den, der alles kaputt gemacht hat“ dachte, passte in das Glas nur Schlechtes. Er schrieb
      die Aufschrift um — auf einen einfachen Namen — und plötzlich passte auch Gutes hinein.
      Wie du etwas nennst, entscheidet darüber, was hineinpasst.` }
  ]
});

/* ===================== KAPITEL 3 ===================== */
window.BOOK.chapters.push({
  id: `rozdil3`,
  num: `Kapitel 3`,
  title: `Solange es dunkel ist — leuchte`,
  blocks: [
    { t:`postcard`, from:`🐈 Postkarte von Tsugi · Osaka`, stamp:`🏮`, p:[
      `„Hier brennen die Laternen bis zum Morgengrauen und gehen von allein aus. Niemand sitzt die
       ganze Nacht bei ihnen. Eine Regel — und Vertrauen in den Morgen.“`
    ]},
    { t:`story`, p:[
      `Am schwersten war für Max die Nacht. Nicht die Dunkelheit. Der Gedanke daran, wie viel davon
       noch vor ihm lag.`,
      `Er rechnete nach: Wenn man den Strahl mit der Hand dreht, geht das bis halb sechs Uhr morgens.
       Und er war schon vom Rechnen müde, bevor er überhaupt angefangen hatte.`,
      `Aber das Logbuch sagte etwas anderes. Der Strahl dreht sich nicht, weil ihn jemand dreht.
       Sondern weil es eine <strong>Regel</strong> gibt: solange es dunkel ist — leuchte. Der Mechanismus
       schaut nicht auf die Uhr. Er stellt jedes Mal eine einzige kurze Frage: ist es noch dunkel?
       Ja — dreh dich weiter. Nein — halt an.`
    ]},
    { t:`gist`, html:`statt „mach das sechzigmal“ sagen wir „mach es, solange es dunkel ist“.
      Wie oft das wird, zählt der Leuchtturm selbst.` },
    { t:`journal`, title:`Dafür war also das leere Glas da`, blocks:[
      { t:`p`, html:`Erinnerst du dich an das zweite Glas des Wärters — das mit der Aufschrift
        <em>nacht</em>, in dem morgens nichts war? Es sollte auch nichts enthalten. Am Tag ist die
        Nacht schon zu Ende gezählt, darum ist das Glas leer. Und sobald es zu dämmern beginnt, legen
        sich so viele Kerne hinein, wie Drehungen bis zum Morgen bleiben.` },
      { t:`small`, html:`Deshalb sieht man in den Tag-Sandkästen dieses Buches das Glas „nacht“ nicht
        auf der Fensterbank, und in den Nacht-Sandkästen taucht es von allein auf. Schau auf die Gläser
        neben dem Leuchtturm — und du weißt schon, welche Tageszeit gerade ist.` },
      { t:`p`, html:`Und jetzt das Allerwichtigste. Das Glas <code>nacht</code> wird nicht von allein
        leer. Niemand rührt es an, solange du nicht selbst einen Kern herausnimmst:` },
      { t:`anatomy`, tokens:[
        { k:`fn`,   glyph:`nacht`, cap:`wohin legen` },
        { k:`punc`, glyph:` = `,   cap:`„leg das hier hinein“` },
        { k:`fn`,   glyph:`nacht`, cap:`wie viele es waren` },
        { k:`punc`, glyph:` - `,   cap:`herausnehmen` },
        { k:`num`,  glyph:`1`,     cap:`eine Drehung ist vorbei` }
      ]},
      { t:`p`, html:`Und <code>dunkel()</code> ändert gar nichts. Es schaut nur ins Glas und antwortet:
        ja oder nein. Sind Kerne da — es ist noch dunkel. Ist es leer — Morgengrauen.` },
      { t:`small`, html:`<code>dunkel()</code> ist keine Tat, sondern eine <strong>Frage</strong>.
        Darauf gibt es nur zwei Antworten. Über Fragen mehr im nächsten Kapitel.` }
    ]},
    { t:`journal`, title:`Zerlegen wir die Schleife`, blocks:[
      { t:`anatomy`, tokens:[
        { k:`kw`,   glyph:`while`,    cap:`„solange“ — wiederhole` },
        { k:`fn`,   glyph:` dunkel()`, cap:`die Bedingung — solange es dunkel ist` },
        { k:`punc`, glyph:`:`,         cap:`und jetzt die Tat` }
      ]},
      { t:`small`, html:`Die Zeile unter <code>while</code> ist nach rechts gerückt — das ist die
        <strong>Einrückung</strong>. Sie sagt: „genau das wiederhole“. Der Leuchtturm wiederholt es und
        fragt jedes Mal — noch dunkel? — bis der Morgen kommt.` },
      { t:`p`, html:`Und nun die Hauptregel aller Schleifen. <strong>Etwas darin muss das Ende
        näher bringen.</strong> Bei uns: einen Kern aus dem Glas „nacht“ herausnehmen.` },
      { t:`p`, html:`Tust du das nicht, wird das Glas nie leer. <code>dunkel()</code> antwortet ewig
        „ja“, und der Leuchtturm dreht sich bis ans Ende der Welt. Dann hält Tsugi dich an und sagt es
        dir — ruhig, ohne böse zu sein.` },
      { t:`gist`, html:`eine Schleife ist eine Regel und ein Ausgang. Die Regel oben, der Ausgang innen.
        Vergisst du den Ausgang, kommst du nie wieder heraus.` }
    ]},
    { t:`journal`, title:`Das Diagramm der Schleife — hier taucht die Raute auf`, blocks:[
      { t:`diagram`, label:`Diagramm der while-Schleife`, svg:`
        <svg viewBox="0 0 300 250" width="300" role="img" aria-label="Diagramm der while-Schleife">
          <defs><marker id="ar2" markerWidth="9" markerHeight="9" refX="6" refY="4.5" orient="auto"><polygon points="0,0 9,4.5 0,9" fill="#5b567e"/></marker></defs>
          <g font-family="Nunito" font-size="12" text-anchor="middle" fill="#2b2748">
            <rect x="100" y="6" width="100" height="28" rx="14" fill="#ffe0ee" stroke="#b03e73"/><text x="150" y="24">Nacht beginnt</text>
            <line x1="150" y1="34" x2="150" y2="52" stroke="#5b567e" stroke-width="2" marker-end="url(#ar2)"/>
            <polygon points="150,54 230,92 150,130 70,92" fill="#fff2cf" stroke="#a5741a"/><text x="150" y="88">noch dunkel?</text>
            <line x1="70" y1="92" x2="30" y2="92" stroke="#5b567e" stroke-width="2"/><text x="50" y="84" fill="#1c7a6e">ja</text>
            <rect x="6" y="150" width="88" height="30" rx="4" fill="#d4f5ef" stroke="#1c7a6e"/><text x="50" y="169">Strahl drehen</text>
            <line x1="30" y1="92" x2="30" y2="150" stroke="#5b567e" stroke-width="2" marker-end="url(#ar2)"/>
            <line x1="94" y1="165" x2="150" y2="165" stroke="#5b567e" stroke-width="2"/>
            <line x1="150" y1="165" x2="150" y2="130" stroke="#5b567e" stroke-width="2" marker-end="url(#ar2)"/><text x="192" y="160" font-size="10" fill="#5b567e">wiederholen</text>
            <line x1="230" y1="92" x2="266" y2="92" stroke="#5b567e" stroke-width="2"/><text x="250" y="84" fill="#b03e73">nein</text>
            <line x1="266" y1="92" x2="266" y2="210" stroke="#5b567e" stroke-width="2"/>
            <rect x="180" y="212" width="118" height="30" rx="15" fill="#ffe0ee" stroke="#b03e73"/><text x="239" y="231">Morgen — Ende</text>
            <line x1="266" y1="210" x2="266" y2="212" stroke="#5b567e" stroke-width="2" marker-end="url(#ar2)"/>
          </g>
        </svg>` }
    ]},
    { t:`story`, p:[
      `Starte die Schleife. Schau auf das Glas „nacht“ neben dem Leuchtturm: jedes Mal, wenn sich der
       Strahl dreht, verschwindet ein Kern daraus. Ist das Glas leer — Morgen, und die Schleife hält
       von allein an.`,
      `(Im Sandkasten dauert die Nacht sechs Drehungen, damit man nicht bis zum Morgen warten muss.)`
    ]},
    { t:`sb`, title:`Halt das Licht die ganze Nacht`, ticks:6, night:true, code:
`while dunkel():
    strahl_drehen()
    nacht = nacht - 1

zeigen("der Morgen ist da")` },
    { t:`small`, html:`Und jetzt versuch, die Zeile <code>nacht = nacht - 1</code> zu löschen und zu
      starten. Du siehst genau das, wovon Tsugi gesprochen hat. Das ist kein Defekt — das ist der
      häufigste Fehler von allen, die Schleifen schreiben. Mach ihn hier, damit du ihn später
      wiedererkennst.` },
    { t:`journal`, title:`Noch eine Schleife — for`, blocks:[
      { t:`p`, html:`Unterhalb des Leuchtturms, am Hang, wächst eine <strong>Reihe</strong> Sonnenblumen.
        Sie müssen gegossen werden — alle, ohne eine auszulassen.` },
      { t:`word`, term:`Reihe`, html:`das ist kein Glas und kein Befehl. Das sind mehrere Dinge, die
        hintereinander stehen — wie Sonnenblumen im Beet. In ein Glas legt man <em>eine</em> Zahl;
        in einer Reihe stehen <em>mehrere</em> Dinge, und jedes hat seinen Platz: das erste, das zweite,
        das dritte. Und die Reihe weiß selbst, wie viele es sind — du musst nicht zählen.` },
      { t:`p`, html:`Durch die Reihe gehen heißt: bei jedem der Reihe nach vorbeischauen:` },
      { t:`sb`, title:`Jede nach der anderen`, code:
`for sonnenblume in reihe:
    wasser_geben(sonnenblume)
    zeigen("gegossen:", sonnenblume)` },
      { t:`small`, html:`<code>while</code> — „solange etwas wahr ist“. <code>for</code> — „geh bei
        jedem vorbei, lass keinen aus“.` },
      { t:`p`, html:`Max mochte <code>for</code> wegen einer einzigen Sache: Damit kann man niemanden
        vergessen. Die Reihe weiß selbst, wie viele Sonnenblumen in ihr stehen — du musst dir das
        nicht merken.` }
    ]},
    { t:`max`, p:[
      `Die Nacht hörte in dem Moment auf, lang zu sein, als ich aufhörte, sie zu zählen. Ich habe
       einfach eine Regel geschrieben — und bin schlafen gegangen. Zum ersten Mal seit einer Woche.`
    ]},
    { t:`task`, id:`t3-1`, title:`Eine Nacht ohne dich`,
      goal:`Sorg dafür, dass sich der Strahl von allein dreht, solange es draußen dunkel ist — und
            dass der Leuchtturm, wenn es hell wird, das Wort „morgen“ ins Logbuch sagt.
            Im Glas „nacht“ liegen sechs Drehungen: verbrauch sie alle.`,
      sbTitle:`Solange es dunkel ist`, ticks:6, night:true,
      code:`feuer_anzünden()\n\n# und jetzt die Regel der Nacht\n`,
      hints:[
        `Die Regel fängt mit <code>while dunkel():</code> an.`,
        `Innen stehen zwei Dinge: den Strahl drehen — und einen Kern herausnehmen:
         <code>nacht = nacht - 1</code>.`,
        `Was sich wiederholt, ist um einen Schritt nach rechts gerückt. Der Knopf „while dunkel():“
         rückt von allein ein.`
      ],
      solution:`feuer_anzünden()

while dunkel():
    strahl_drehen()
    nacht = nacht - 1

zeigen("morgen")`,
      checks:[{r:`uses`, what:`while`}, {r:`calls`, what:`rotate`, min:6},
              {r:`jar`, name:`nacht`, is:0}, {r:`printed`, like:`morgen`}] },

    { t:`task`, id:`t3-3`, kind:`fix`, title:`Die Schleife, die nicht anhält`,
      goal:`Max hat es so geschrieben und ist schlafen gegangen. Der Leuchtturm drehte sich und
            drehte sich — und Tsugi hat ihn angehalten. Finde heraus, was hier fehlt, und füg eine
            Zeile hinzu.`,
      sbTitle:`Repariere Max’ Nacht`, ticks:6, night:true,
      code:`feuer_anzünden()\n\nwhile dunkel():\n    strahl_drehen()\n`,
      hints:[
        `Starte erst einfach und lies, was Tsugi sagt. Er nennt genau das, was fehlt.`,
        `Das Glas „nacht“ wird nicht von allein leer. Jemand muss jedes Mal einen Kern herausnehmen.`
      ],
      solution:`feuer_anzünden()

while dunkel():
    strahl_drehen()
    nacht = nacht - 1`,
      checks:[{r:`uses`, what:`while`}, {r:`jar`, name:`nacht`, is:0}, {r:`calls`, what:`rotate`, min:6}] },

    { t:`task`, id:`t3-2`, title:`Lass keine aus`,
      goal:`In der Reihe stehen drei Sonnenblumen. Geh bei jeder vorbei, gib Wasser — und sag über
            jede etwas ins Logbuch.`,
      sbTitle:`Die Reihe Sonnenblumen`,
      code:`# geh durch die Reihe\n`,
      hints:[
        `Es fängt mit <code>for sonnenblume in reihe:</code> an.`,
        `Innen zwei Taten: <code>wasser_geben(sonnenblume)</code> und <code>zeigen(…)</code>.`
      ],
      solution:`for sonnenblume in reihe:
    wasser_geben(sonnenblume)
    zeigen("gegossen:", sonnenblume)`,
      checks:[{r:`uses`, what:`for`}, {r:`watered`, min:3}, {r:`printed`}] },

    { t:`bridge`, pairs:[
      [`solange`, `while`, `dasselbe Wort, nur auf Englisch`],
      [`geh bei jedem vorbei`, `for … in …`, `„für jedes aus …“`],
      [`nacht = nacht - 1`, `nacht -= 1`, `Erwachsene schreiben es kürzer — es ist dasselbe`],
      [`wie viele Male`, `range(5)`, `fünfmal hintereinander`]
    ], html:`Das sind echte Wörter aus Python. Wenn du irgendwann ein Erwachsenenbuch über Code
      aufschlägst — du weißt schon, was da steht.` },

    { t:`applied`, id:`life-3`, title:`Das Muster, das sich wiederholt.`, html:`Max fiel auf, dass ein
      Sturm immer gleich anfängt: Stille, Wind aus Norden, der erste Tropfen. Und als er dieses
      Muster erkannt hatte, wurde es weniger unheimlich. Such ein Muster in deinem Tag: Was kommt
      fast immer nach was?` }
  ]
});

/* ===================== KAPITEL 4 ===================== */
window.BOOK.chapters.push({
  id: `rozdil4`,
  num: `Kapitel 4`,
  title: `Die drei Köpfe des Zerberus`,
  blocks: [
    { t:`postcard`, from:`🐈 Postkarte von Tsugi · Hakone-Berge`, stamp:`⛰`, p:[
      `„Das Wetter wechselt hier jede Stunde. Die Leute streiten nicht mit ihm — sie schauen einfach,
       was draußen ist, und machen etwas anderes. Zerberus würde das verstehen.“`
    ]},
    { t:`story`, p:[
      `An jenem Abend kam Zerberus früher — alle drei Köpfe auf einmal, wie immer. Max goss gerade die
       Lampe nach und nahm einen Kern aus dem Glas „kanister“, ohne hinzusehen — die Hand wusste es
       schon von allein.`,
      `Und während Zerberus sich hinlegte, bemerkte Max etwas Seltsames. Drei Köpfe — aber Zerberus
       handelt immer nur mit einem. Er fragt sich offenbar, welcher Kopf hier passt, und schickt genau
       den nach vorn. Den erschrockenen — wenn Sturm ist. Den hungrigen — wenn ein Gast mit einer Tüte
       kommt. Den stillen weisen — wenn einfach nur Stille ist und Feld.`,
      `Die anderen beiden verschwinden dabei nicht. Sie warten nur auf ihr Wetter.`
    ]},
    { t:`journal`, title:`Zerlegen wir die Wahl`, blocks:[
      { t:`anatomy`, tokens:[
        { k:`kw`,   glyph:`if`, cap:`„falls“ — die erste Frage` },
        { k:`fn`,   glyph:` wind == "stark"`, cap:`die Bedingung, die wir prüfen` },
        { k:`punc`, glyph:`:`, cap:`was zu tun ist, wenn ja` }
      ]},
      { t:`small`, html:`Hier ist <code>==</code> (zwei Zeichen) eine <strong>Frage</strong>: „gleich?“.
        Verwechsle es nicht mit dem einen <code>=</code>, das einen Wert <em>hineinlegt</em>.` },
      { t:`p`, html:`Das eine ist die Hand, die einen Kern ins Glas legt. Das andere ist das Auge,
        das auf zwei Gläser schaut und fragt: ist da gleich viel drin?` },
      { t:`gist`, html:`ein Zeichen <code>=</code> — die Hand. Zwei Zeichen <code>==</code> — das Auge.
        Die Hand legt hinein, das Auge schaut nur.` },
      { t:`diagram`, label:`Diagramm der Wahl mit if, elif, else`, svg:`
        <svg viewBox="0 0 320 300" width="320" role="img" aria-label="Diagramm der Wahl mit if, elif, else">
          <defs><marker id="ar3" markerWidth="9" markerHeight="9" refX="6" refY="4.5" orient="auto"><polygon points="0,0 9,4.5 0,9" fill="#5b567e"/></marker></defs>
          <g font-family="Nunito" font-size="11.5" text-anchor="middle" fill="#2b2748">
            <polygon points="90,6 168,38 90,70 12,38" fill="#fff2cf" stroke="#a5741a"/><text x="90" y="42">Wind stark?</text>
            <line x1="168" y1="38" x2="205" y2="38" stroke="#5b567e" stroke-width="2" marker-end="url(#ar3)"/><text x="187" y="30" fill="#1c7a6e">ja</text>
            <rect x="207" y="24" width="106" height="28" rx="4" fill="#d4f5ef" stroke="#1c7a6e"/><text x="260" y="42">Docht dämpfen</text>
            <line x1="90" y1="70" x2="90" y2="90" stroke="#5b567e" stroke-width="2" marker-end="url(#ar3)"/><text x="112" y="84" fill="#b03e73">nein</text>
            <polygon points="90,92 168,124 90,156 12,124" fill="#fff2cf" stroke="#a5741a"/><text x="90" y="128">Gast auf dem Pfad?</text>
            <line x1="168" y1="124" x2="205" y2="124" stroke="#5b567e" stroke-width="2" marker-end="url(#ar3)"/><text x="187" y="116" fill="#1c7a6e">ja</text>
            <rect x="207" y="110" width="106" height="28" rx="4" fill="#d4f5ef" stroke="#1c7a6e"/><text x="260" y="128">Licht zum Pfad</text>
            <line x1="90" y1="156" x2="90" y2="182" stroke="#5b567e" stroke-width="2" marker-end="url(#ar3)"/><text x="112" y="174" fill="#b03e73">nein</text>
            <rect x="30" y="184" width="120" height="28" rx="4" fill="#d4f5ef" stroke="#1c7a6e"/><text x="90" y="202">volles Licht (else)</text>
            <line x1="90" y1="212" x2="90" y2="236" stroke="#5b567e" stroke-width="2" marker-end="url(#ar3)"/>
            <rect x="40" y="238" width="100" height="28" rx="14" fill="#ffe0ee" stroke="#b03e73"/><text x="90" y="256">fertig</text>
          </g>
        </svg>` }
    ]},
    { t:`story`, p:[
      `Stell oben im Sandkasten das Wetter ein — und schau, welcher Zweig anspringt. Der Computer geht
       die Fragen von oben nach unten durch und bleibt beim <strong>ersten „ja“</strong> stehen.
       Den Rest liest er gar nicht mehr — wie Zerberus, der seinen Kopf schon gewählt hat.`
    ]},
    { t:`sb`, title:`Was macht Zerberus?`, scenarios:true, code:
`if wind == "stark":
    docht_dämpfen()
elif gast_auf_dem_pfad():
    linse_drehen("pfad")
    volles_licht()
else:
    volles_licht()` },
    { t:`small`, html:`<code>elif</code> heißt „und wenn nicht, dann vielleicht das hier?“.
      <code>else</code> heißt „und wenn nichts davon gepasst hat, mach es so“. <code>else</code> steht
      immer ganz am Ende.` },
    { t:`task`, id:`t4-1`, title:`Drei Köpfe — drei Wetter`,
      goal:`Bring dem Leuchtturm bei, selbst zu wählen. Starker Wind — den Docht dämpfen.
            Gast auf dem Pfad — die Linse nach <code>"pfad"</code> drehen und volles Licht geben.
            Und bei Stille — einfach volles Licht. Der Leuchtturm jagt deinen Code danach selbst durch
            alle drei Wetter und sagt dir, ob es überall geklappt hat.`,
      sbTitle:`Die Wahl des Zerberus`, ticks:2,
      code:`# frag nach dem Wind, dann nach dem Gast, und am Ende else\n`,
      hints:[
        `Nach <code>if</code> kommt <code>elif gast_auf_dem_pfad():</code> und ganz am Schluss
         <code>else:</code>`,
        `Denk dran: <code>==</code> fragt „gleich?“, und <code>=</code> legt ins Glas hinein.`
      ],
      solution:`if wind == "stark":
    docht_dämpfen()
elif gast_auf_dem_pfad():
    linse_drehen("pfad")
    volles_licht()
else:
    volles_licht()`,
      checks:[{r:`uses`, what:`if`}, {r:`uses`, what:`else`}],
      trials:[
        { label:`starker Wind`,      world:{ wind:`stark` }, checks:[{r:`light`, is:`dim`}] },
        { label:`Gast auf dem Pfad`, world:{ guest:true },   checks:[{r:`lens`, to:`pfad`}, {r:`light`, is:`full`}] },
        { label:`Stille`,            world:{},               checks:[{r:`light`, is:`full`}] }
      ] },

    { t:`task`, id:`t4-2`, title:`Wenn der Brennstoff knapp ist`,
      goal:`Lass den Leuchtturm auf sich selbst aufpassen: Wenn im Glas „vorrat“ weniger als drei
            Nächte sind — gedämpft leuchten, und wenn mehr — mit voller Kraft. Gerade sind zwei
            Nächte im Glas.`,
      sbTitle:`Der sparsame Leuchtturm`, fuel:2,
      code:`# schau ins Glas und wähle\n`,
      hints:[
        `Das Zeichen <code>&lt;</code> heißt „kleiner als“. Eine Frage über eine Zahl schreibt man so:
         <code>if vorrat &lt; 3:</code>`,
        `Wenn die erste Frage nicht zutrifft, kommt <code>else:</code>, und darin volles Licht.`
      ],
      solution:`if vorrat < 3:
    docht_dämpfen()
else:
    volles_licht()`,
      checks:[{r:`uses`, what:`if`}, {r:`uses`, what:`else`}, {r:`light`, is:`dim`}],
      trials:[{ label:`genug Brennstoff`, world:{ fuel:10 }, checks:[{r:`light`, is:`full`}] }] },

    { t:`task`, id:`t4-3`, kind:`fix`, title:`Der Kopf, der nicht abgewartet hat`,
      goal:`Max hat eine Wahl geschrieben — aber der Leuchtturm leuchtet bei starkem Wind aus
            irgendeinem Grund mit voller Kraft. Schau dir die Reihenfolge der Fragen an.
            Der Computer bleibt beim ersten „ja“ stehen.`,
      sbTitle:`Repariere die Wahl`, ticks:2, scenarios:true,
      code:`if vorrat > 0:\n    volles_licht()\nelif wind == "stark":\n    docht_dämpfen()\nelse:\n    volles_licht()\n`,
      hints:[
        `Stell oben im Sandkasten das Wetter „starker Wind“ ein und starte. Welcher Zweig ist
         angesprungen?`,
        `Die erste Frage sagt immer „ja“ — Brennstoff ist ja da. Also kommt die zweite gar nicht dran.
         Stell die Frage nach dem Wind nach vorn, und die Frage nach dem Brennstoff darf bleiben —
         nur als zweite. Du musst keinen Kopf wegwerfen.`
      ],
      solution:`if wind == "stark":
    docht_dämpfen()
elif vorrat > 0:
    volles_licht()
else:
    docht_dämpfen()`,
      checks:[{r:`uses`, what:`if`}, {r:`uses`, what:`else`}],
      trials:[
        { label:`starker Wind`, world:{ wind:`stark` }, checks:[{r:`light`, is:`dim`}] },
        { label:`Stille`,       world:{ wind:`still` }, checks:[{r:`light`, is:`full`}] }
      ] },

    { t:`bridge`, pairs:[
      [`falls`, `if`, `die erste Frage`],
      [`und wenn nicht, dann vielleicht`, `elif`, `die nächste Frage`],
      [`und wenn nichts davon`, `else`, `der letzte Zweig`],
      [`gleich?`, `==`, `Vergleich, keine Zuweisung`],
      [`kleiner / größer`, `&lt; &gt;`, `Fragen über Zahlen`]
    ], html:`<code>if</code>, <code>elif</code>, <code>else</code> — das ist schon echtes Python,
      ganz ohne Übersetzung. Du hast es gerade selbst geschrieben.` },

    { t:`applied`, id:`life-4`, title:`Die Pause, in der die Wahl wohnt.`, html:`Als jemand etwas
      Gemeines zu Max sagte, hielt er eine Sekunde inne und ging die „Köpfe“ durch: wütend werden?
      schweigen? einen Witz machen? Diese winzige Pause machte die Antwort zu <em>seiner Wahl</em>
      und nicht zu einem Blitz. Versuch beim nächsten Mal, erst die Zweige durchzugehen.` }
  ]
});

/* ===================== KAPITEL 5 ===================== */
window.BOOK.chapters.push({
  id: `rozdil5`,
  num: `Kapitel 5`,
  title: `Eine Gewohnheit, die man benennen kann`,
  blocks: [
    { t:`postcard`, from:`🐈 Postkarte von Tsugi · Tokio`, stamp:`🌃`, p:[
      `„Morgens wasche ich mich hier genau wie zu Hause — Pfote, Ohr, hinter dem Ohr. Ich denke nicht
       an die Schritte. Ein Wort, ‚waschen‘ — und der Körper weiß den Rest von allein.“`
    ]},
    { t:`story`, p:[
      `Eine Woche verging. Max schrieb die vier Schritte des Leuchtturms schon, ohne hinzusehen — und
       genau deshalb fingen sie an, ihn zu nerven. Jeden Abend dasselbe, und jeden Abend die Chance,
       etwas auszulassen.`,
      `Und da fiel ihm ein, wie Tsugi sich wäscht. Viele Schritte — Pfote, Ohr, hinter dem Ohr —,
       aber im Kopf nur ein Wort. Was, wenn man die Schritte des Leuchtturms genauso in einen Namen
       einpacken könnte?`
    ]},
    { t:`journal`, title:`Zerlegen wir, wie man Schritte in einen Namen packt`, blocks:[
      { t:`anatomy`, tokens:[
        { k:`kw`,   glyph:`def`, cap:`„hier ist eine neue Gewohnheit“` },
        { k:`fn`,   glyph:` leuchtturm_anzünden`, cap:`Name der Gewohnheit` },
        { k:`punc`, glyph:`():`, cap:`und jetzt die Schritte` }
      ]},
      { t:`p`, html:`Achtung: <code>def</code> tut gar nichts. Es <em>schreibt die Gewohnheit nur ins
        Gedächtnis</em> — wie eine Seite im Logbuch. Die Schritte passieren erst dann, wenn du den
        Namen mit Klammern rufst.` },
      { t:`diagram`, label:`Diagramm: vier Schritte werden zu einem Namen eingepackt`, svg:`
        <svg viewBox="0 0 340 210" width="340" role="img" aria-label="Diagramm: vier Schritte werden zu einem Namen eingepackt">
          <defs><marker id="ar5" markerWidth="9" markerHeight="9" refX="6" refY="4.5" orient="auto"><polygon points="0,0 9,4.5 0,9" fill="#5b567e"/></marker></defs>
          <g font-family="Nunito" font-size="10.5" text-anchor="middle" fill="#2b2748">
            <text x="60" y="14" font-size="11" fill="#5b567e">jeden Abend neu</text>
            <rect x="6" y="22" width="108" height="24" rx="4" fill="#d4f5ef" stroke="#1c7a6e"/><text x="60" y="38">Glas putzen</text>
            <rect x="6" y="50" width="108" height="24" rx="4" fill="#d4f5ef" stroke="#1c7a6e"/><text x="60" y="66">Docht richten</text>
            <rect x="6" y="78" width="108" height="24" rx="4" fill="#d4f5ef" stroke="#1c7a6e"/><text x="60" y="94">Linse drehen</text>
            <rect x="6" y="106" width="108" height="24" rx="4" fill="#d4f5ef" stroke="#1c7a6e"/><text x="60" y="122">Feuer anzünden</text>

            <line x1="120" y1="76" x2="160" y2="76" stroke="#5b567e" stroke-width="2" marker-end="url(#ar5)"/>
            <text x="140" y="68" font-size="10" fill="#5b567e">def</text>
            <text x="140" y="92" font-size="10" fill="#5b567e">einpacken</text>

            <rect x="166" y="58" width="150" height="36" rx="8" fill="#fff2cf" stroke="#a5741a" stroke-width="2"/>
            <text x="241" y="81" font-size="11" font-weight="700">leuchtturm_anzünden()</text>
            <text x="241" y="112" font-size="10" fill="#5b567e">ein Wort — alle vier Schritte</text>

            <line x1="241" y1="122" x2="241" y2="146" stroke="#5b567e" stroke-width="2" marker-end="url(#ar5)"/>
            <rect x="166" y="148" width="150" height="26" rx="13" fill="#ffe0ee" stroke="#b03e73"/>
            <text x="241" y="165">ruf es — und es passiert</text>
            <text x="241" y="194" font-size="10" fill="#b03e73">ohne Ruf passiert gar nichts</text>
          </g>
        </svg>`, caption:`def schreibt die Gewohnheit nur auf. Die Klammern am Ende — das ist erst das „tu es“.` },
      { t:`gist`, html:`<code>def</code> heißt „merk dir das“. Der Name mit Klammern heißt „tu es“.
        Das sind zwei verschiedene Ereignisse, und dazwischen können hundert Zeilen liegen.` }
    ]},
    { t:`sb`, title:`Mit einem Wort — der ganze Leuchtturm`, code:
`def leuchtturm_anzünden():
    glas_putzen()
    docht_richten()
    linse_drehen("norden")
    feuer_anzünden()

leuchtturm_anzünden()` },
    { t:`small`, html:`Versuch, die letzte Zeile zu löschen und zu starten. Der Leuchtturm geht nicht
      an — und das ist kein Fehler: die Gewohnheit ist geschrieben, aber kein einziges Mal gerufen.` },
    { t:`journal`, title:`Ein Fenster für einen Hinweis — der <em>Parameter</em>`, blocks:[
      { t:`p`, html:`Manchmal muss der Strahl zweimal gedreht werden, manchmal fünfmal. Wir geben dem
        Namen ein Fenster für eine Zahl:` },
      { t:`sb`, title:`Ruf die Gewohnheit mit einer Zahl`, code:
`def drehen(wie_oft):
    for mal in range(wie_oft):
        strahl_drehen()

feuer_anzünden()
drehen(3)` },
      { t:`small`, html:`Ändere die Zahl in <code>drehen(3)</code> und starte noch einmal.` }
    ]},
    { t:`journal`, title:`„Tu“ oder „sag“ — <code>return</code>`, blocks:[
      { t:`p`, html:`Es gibt Gewohnheiten, die <strong>tun</strong>. Und es gibt welche, die
        <strong>antworten</strong> — die eine Zahl zurückgeben. Dafür ist <code>return</code> da:` },
      { t:`sb`, title:`Eine Gewohnheit, die antwortet`, code:
`def wie_viele_giessen(reihe):
    return zählen(reihe)

anzahl = wie_viele_giessen(reihe)
zeigen("Sonnenblumen in der Reihe:", anzahl)` },
      { t:`small`, html:`„Tu mir“ und „sag mir“ sind zwei verschiedene Bitten. Der Code weiß das auch.` },
      { t:`p`, html:`Was eine Gewohnheit „gesagt“ hat, kann man sofort in ein Glas legen — so wie Max
        die Antwort in das Glas mit der Aufschrift <code>anzahl</code> legte.` }
    ]},
    { t:`max`, p:[
      `Komisch: Ich habe nichts Neues erfunden. Die Schritte sind dieselben. Sie haben jetzt nur einen
       Namen — und im Kopf ist es um vier Zeilen stiller geworden.`
    ]},
    { t:`task`, id:`t5-1`, title:`Gib deinem Abend einen Namen`,
      goal:`Pack die vier Schritte des Leuchtturms in einen einzigen Namen — <code>mein_abend</code> —
            und ruf ihn.`,
      sbTitle:`Ein Wort`,
      code:`def mein_abend():\n    glas_putzen()\n    # und noch drei Schritte\n\n# und hier ruf die Gewohnheit\n`,
      hints:[
        `Die Schritte innen sind um einen Schritt nach rechts gerückt.`,
        `Rufen heißt: eine eigene Zeile, ganz am linken Rand: <code>mein_abend()</code>`
      ],
      solution:`def mein_abend():
    glas_putzen()
    docht_richten()
    linse_drehen("norden")
    feuer_anzünden()

mein_abend()`,
      checks:[{r:`habit`, name:`mein_abend`}, {r:`order`, steps:[`clean`,`trim`,`lens`,`ignite`]}, {r:`lit`}] },

    { t:`task`, id:`t5-2`, title:`So viele Drehungen, wie du sagst`,
      goal:`Bau eine Gewohnheit <code>drehen(wie_oft)</code> mit einem Fenster für eine Zahl — und
            ruf sie so, dass sich der Strahl genau fünfmal dreht.`,
      sbTitle:`Ein Fenster für eine Zahl`,
      code:`def drehen(wie_oft):\n    strahl_drehen()   # es müssten aber „wie_oft“ Male sein\n\nfeuer_anzünden()\n`,
      hints:[
        `Innen hilft dir <code>for mal in range(wie_oft):</code>`,
        `Und vergiss nicht, die Gewohnheit unten mit einer Zahl zu rufen: <code>drehen(5)</code>`
      ],
      solution:`def drehen(wie_oft):
    for mal in range(wie_oft):
        strahl_drehen()

feuer_anzünden()
drehen(5)`,
      checks:[{r:`uses`, what:`param`}, {r:`calls`, what:`rotate`, is:5}] },

    { t:`task`, id:`t5-3`, title:`Eine Gewohnheit, die antwortet`,
      goal:`Schreib eine Gewohnheit, die nichts tut, sondern <em>sagt</em>, wie viele Sonnenblumen in
            der Reihe stehen. Leg ihre Antwort in ein Glas mit der Aufschrift <code>anzahl</code>
            und zeig sie.`,
      sbTitle:`Sag es mir`,
      code:`def wie_viele_in_der_reihe(reihe):\n    return 0   # es müsste aber die echte Zahl sein\n`,
      hints:[
        `Eine Antwort gibt man mit dem Wort <code>return</code> zurück.`,
        `Zählen kann der fertige Befehl <code>zählen(reihe)</code>.`
      ],
      solution:`def wie_viele_in_der_reihe(reihe):
    return zählen(reihe)

anzahl = wie_viele_in_der_reihe(reihe)
zeigen("Sonnenblumen:", anzahl)`,
      checks:[{r:`uses`, what:`return`}, {r:`jar`, name:`anzahl`, is:3}, {r:`printed`}] },

    { t:`task`, id:`t5-4`, kind:`fix`, title:`Die Gewohnheit, die niemand gerufen hat`,
      goal:`Max hat eine Gewohnheit in den Kasten geschrieben, ist schlafen gegangen — und in der Nacht
            leuchtete der Leuchtturm nicht. Der Kasten hat alles richtig gemacht. Nur hat ihm niemand
            „tu es“ gesagt.`,
      sbTitle:`Repariere den Abend`, ticks:6, fuel:12,
      code:`def abend():\n    glas_putzen()\n    docht_richten()\n    linse_drehen("norden")\n    feuer_anzünden()\n`,
      hints:[
        `Starte. Der Leuchtturm ist dunkel — und kein einziger Fehler. Warum?`,
        `<code>def</code> schreibt nur auf. Füg unten eine eigene Zeile ganz am linken Rand hinzu:
         <code>abend()</code>`
      ],
      solution:`def abend():
    glas_putzen()
    docht_richten()
    linse_drehen("norden")
    feuer_anzünden()

abend()`,
      checks:[{r:`habit`, name:`abend`}, {r:`lit`}, {r:`order`, steps:[`clean`,`trim`,`lens`,`ignite`]}] },

    { t:`task`, id:`t5-5`, title:`Ein Fenster für ein Wort`,
      goal:`Ein Fenster gibt es nicht nur für Zahlen. Bau eine Gewohnheit <code>schauen(wohin)</code>,
            die die Linse in die Richtung dreht, die man ihr sagt, und das ins Logbuch schreibt.
            Ruf sie mit dem Wort <code>"pfad"</code>.`,
      sbTitle:`Wohin du sagst`, ticks:2,
      code:`def schauen(wohin):\n    zeigen("und hier müsste sich die Linse drehen")\n\nfeuer_anzünden()\n`,
      hints:[
        `Innen: <code>linse_drehen(wohin)</code> — ohne Anführungszeichen, denn das ist schon das
         Fenster und nicht das Wort.`,
        `Und unten ruf sie mit dem Wort: <code>schauen("pfad")</code>`
      ],
      solution:`def schauen(wohin):
    linse_drehen(wohin)
    zeigen("die Linse zeigt nach", wohin)

feuer_anzünden()
schauen("pfad")`,
      checks:[{r:`uses`, what:`param`}, {r:`habit`, name:`schauen`},
              {r:`lens`, to:`pfad`}, {r:`printed`}] },

    { t:`task`, id:`t5-6`, title:`Eine Gewohnheit, die rechnet`,
      goal:`Ein Kanister sind vier Nächte. Bau eine Gewohnheit <code>nächte(kanisterzahl)</code>, die
            nichts mit dem Leuchtturm macht, sondern <em>sagt</em>, für wie viele Nächte es reicht.
            Rechne es für drei Kanister aus, leg die Antwort in das Glas
            <code>nächte_aus_dem_lager</code> und zeig es.`,
      sbTitle:`Rechne voraus`,
      code:`def nächte(kanisterzahl):\n    return 0   # es müsste aber die echte Zahl sein\n`,
      hints:[
        `Vier Nächte pro Kanister — das ist Malnehmen: <code>kanisterzahl * 4</code>.`,
        `Die Antwort legt man genauso ins Glas wie eine Zahl:
         <code>nächte_aus_dem_lager = nächte(3)</code>`
      ],
      solution:`def nächte(kanisterzahl):
    return kanisterzahl * 4

nächte_aus_dem_lager = nächte(3)
zeigen("Nächte aus dem Lager:", nächte_aus_dem_lager)`,
      checks:[{r:`uses`, what:`return`}, {r:`uses`, what:`param`},
              {r:`jar`, name:`nächte_aus_dem_lager`, is:12}, {r:`printed`}] },

    { t:`bridge`, pairs:[
      [`Gewohnheit`, `Funktion`, `Schritte, in einen Namen eingepackt`],
      [`hier ist eine neue Gewohnheit`, `def`, `eine Funktion ankündigen`],
      [`Fenster`, `Parameter`, `das, was man in den Klammern mitgibt`],
      [`sagt`, `return`, `gibt eine Antwort zurück`]
    ], html:`Das ist schon fast ein ganzes Erwachsenenbuch über Python — in vier Zeilen. Weiter stehen
      dort dieselben Wörter, nur mit mehr Beispielen.` },

    { t:`applied`, id:`life-5`, title:`Das Fertigmachen am Morgen.`, html:`Max vergaß jeden Morgen
      irgendetwas. Da gab er der Sache einen einzigen Namen — <em>fertigmachen</em> — und die Schritte
      kosteten ihn morgens keine Kraft mehr. Welche deiner Gewohnheiten könntest du „benennen“?` }
  ]
});

/* ===================== KAPITEL 6 ===================== */
window.BOOK.chapters.push({
  id: `rozdil6`,
  num: `Kapitel 6`,
  title: `Die Sturmnacht`,
  blocks: [
    { t:`postcard`, from:`🐈 Postkarte von Tsugi · Flugzeug nach Hause`, stamp:`✈`, p:[
      `„Ich fliege zurück. Es heißt, bei euch kommt ein Unwetter. Du schaffst das, Max. Du weißt
       schon alles, was man dafür braucht — du hast es nur noch nie alles auf einmal versucht.“`
    ]},
    { t:`story`, p:[
      `Der Sturm kam in der Nacht. Der Mechanismus des Leuchtturms verklemmte sich, der Strahl blieb
       reglos hängen und leuchtete auf einen einzigen Punkt, wie ein Mensch, der vergessen hat, wovon
       er gerade sprach. Und unten, irgendwo zwischen den Wellen des Feldes, war ein Boot, das Licht
       brauchte. Genau jetzt.`,
      `Und niemand war da, der ihm hätte vorsagen können — nur der Kasten mit dem Lichtchen, das alte
       Logbuch und Max. Und irgendwo unter der Bank atmete leise Zerberus — mit allen drei Köpfen
       zugleich. Er war früher gekommen und nicht wieder gegangen. Im Glas „kanister“ lag ein einziger
       Kern.`,
      `Max wollte Angst bekommen. Fast hätte er sie bekommen. Und dann ertappte er sich — bei genau
       denselben drei Fragen, die er in der allerersten Nacht über dem Logbuch gestellt hatte:`
    ]},
    { t:`pull`, html:`Was soll wirklich passieren?<br>Aus welchen kleinen Schritten besteht das?<br>Habe ich ein ähnliches Muster schon einmal gesehen?` },
    { t:`story`, p:[
      `Und die Angst, in Schritte zerlegt, war kein einziger großer Haufen mehr. Sie wurde zu Schritten.
       Und den ersten Schritt kann man mit der Hand anpacken.`,
      `Max setzte sich an den Kasten. Die Liste aus der ersten Nacht — da. Das Glas „nacht“ — da, und
       daraus muss man jedes Mal einen Kern nehmen, sonst kommt der Morgen nie. Das Glas mit dem
       Brennstoff — auch da, denn jede Drehung verbrennt Petroleum. Die Regel „solange es dunkel ist“ —
       da. Die Frage nach dem Wind — da. Und ein Name, in den man das alles einpacken kann.`,
      `In einem einzigen Programm kam plötzlich alles zusammen, was er gelernt hatte. Nichts Neues.
       Einfach alles auf einmal.`
    ]},
    { t:`diagram`, label:`Diagramm der Sturmnacht: die Gewohnheit, die Regel der Nacht und die Wahl darin`, svg:`
      <svg viewBox="0 0 330 330" width="330" role="img" aria-label="Diagramm der Sturmnacht: die Gewohnheit, die Regel der Nacht und die Wahl darin">
        <defs><marker id="ar6" markerWidth="9" markerHeight="9" refX="6" refY="4.5" orient="auto"><polygon points="0,0 9,4.5 0,9" fill="#5b567e"/></marker></defs>
        <g font-family="Nunito" font-size="11" text-anchor="middle" fill="#2b2748">
          <rect x="100" y="4" width="130" height="26" rx="13" fill="#ffe0ee" stroke="#b03e73"/><text x="165" y="21">der Abend beginnt</text>
          <line x1="165" y1="30" x2="165" y2="44" stroke="#5b567e" stroke-width="2" marker-end="url(#ar6)"/>
          <rect x="86" y="46" width="158" height="26" rx="4" fill="#d4f5ef" stroke="#1c7a6e"/><text x="165" y="63" font-size="10.5">leuchtturm_anzünden()</text>
          <line x1="165" y1="72" x2="165" y2="86" stroke="#5b567e" stroke-width="2" marker-end="url(#ar6)"/>
          <polygon points="165,88 245,116 165,144 85,116" fill="#fff2cf" stroke="#a5741a"/><text x="165" y="120">noch dunkel?</text>
          <line x1="245" y1="116" x2="292" y2="116" stroke="#5b567e" stroke-width="2"/><text x="270" y="108" fill="#b03e73">nein</text>
          <line x1="292" y1="116" x2="292" y2="288" stroke="#5b567e" stroke-width="2" marker-end="url(#ar6)"/>
          <rect x="232" y="290" width="94" height="26" rx="13" fill="#ffe0ee" stroke="#b03e73"/><text x="279" y="307">Morgen</text>
          <line x1="85" y1="116" x2="48" y2="116" stroke="#5b567e" stroke-width="2"/><text x="66" y="108" fill="#1c7a6e">ja</text>
          <line x1="48" y1="116" x2="48" y2="140" stroke="#5b567e" stroke-width="2" marker-end="url(#ar6)"/>
          <polygon points="88,142 158,166 88,190 18,166" fill="#fff2cf" stroke="#a5741a"/><text x="88" y="170">Wind stark?</text>
          <line x1="158" y1="166" x2="196" y2="166" stroke="#5b567e" stroke-width="2" marker-end="url(#ar6)"/><text x="178" y="158" fill="#1c7a6e">ja</text>
          <rect x="198" y="152" width="112" height="26" rx="4" fill="#d4f5ef" stroke="#1c7a6e"/><text x="254" y="169">Docht dämpfen</text>
          <line x1="88" y1="190" x2="88" y2="206" stroke="#5b567e" stroke-width="2" marker-end="url(#ar6)"/><text x="112" y="202" fill="#b03e73">nein</text>
          <rect x="32" y="208" width="112" height="26" rx="4" fill="#d4f5ef" stroke="#1c7a6e"/><text x="88" y="225">volles Licht</text>
          <line x1="254" y1="178" x2="254" y2="196" stroke="#5b567e" stroke-width="2"/>
          <line x1="254" y1="196" x2="170" y2="196" stroke="#5b567e" stroke-width="2"/>
          <line x1="170" y1="196" x2="170" y2="248" stroke="#5b567e" stroke-width="2"/>
          <line x1="88" y1="234" x2="88" y2="248" stroke="#5b567e" stroke-width="2"/>
          <line x1="88" y1="248" x2="170" y2="248" stroke="#5b567e" stroke-width="2"/>
          <rect x="24" y="250" width="180" height="26" rx="4" fill="#d4f5ef" stroke="#1c7a6e"/><text x="114" y="267">drehen · nacht-1 · vorrat-1</text>
          <line x1="114" y1="276" x2="114" y2="296" stroke="#5b567e" stroke-width="2"/>
          <line x1="114" y1="296" x2="10" y2="296" stroke="#5b567e" stroke-width="2"/>
          <line x1="10" y1="296" x2="10" y2="116" stroke="#5b567e" stroke-width="2"/>
          <line x1="10" y1="116" x2="85" y2="116" stroke="#5b567e" stroke-width="2" marker-end="url(#ar6)"/>
          <text x="50" y="290" fill="#5b567e" font-size="10">wiederholen</text>
        </g>
      </svg>`, caption:`Eine Gewohnheit, eine Regel der Nacht, eine Wahl darin. Sonst nichts Neues.` },

    { t:`sb`, title:`Die Sturmnacht — alles zusammen`, ticks:6, fuel:6, cans:1, night:true, scenarios:true, code:
`def leuchtturm_anzünden():
    glas_putzen()
    docht_richten()
    linse_drehen("norden")
    feuer_anzünden()

leuchtturm_anzünden()

while dunkel():
    if wind == "stark":
        docht_dämpfen()
    else:
        volles_licht()
    strahl_drehen()
    nacht = nacht - 1
    vorrat = vorrat - 1
    zeigen("Brennstoff:", vorrat)

zeigen("Morgen. Kanister im Lager:", kanister)` },
    { t:`story`, p:[
      `Der Strahl zuckte. Er fasste Kraft. Und legte sich als lange weiße Straße über das aufgewühlte
       Feld — bis dorthin, wo das kleine Boot endlich sah, wohin es fahren musste. Max atmete aus.`,
      `Er hat in dieser Nacht nichts Neues gelernt. Er hat zum ersten Mal einfach alles auf einmal
       benutzt — und es hielt. Gegen Morgen goss er den letzten Kanister in die Lampe und drehte das
       Glas auf den Kopf: leer. Aber die Nacht war schon vorbei, und das zählte als Sieg.`
    ]},
    { t:`task`, id:`t6-1`, title:`Deine Sturmnacht`,
      goal:`Die letzte und größte Aufgabe. Bring alles zusammen.
            Zuerst eine Gewohnheit mit dem Namen <code>leuchtturm_anzünden</code> — und ruf sie.
            Dann halt das Licht die ganze Nacht: gedämpft, wenn der Wind stark ist, voll, wenn es
            still ist. Dreh jedes Mal den Strahl und nimm je einen Kern aus zwei Gläsern — „nacht“ und
            „vorrat“. In jedem liegen sechs: verbrauch sie alle.`,
      sbTitle:`Alles zusammen`, ticks:6, fuel:6, cans:1, night:true,
      code:`def leuchtturm_anzünden():\n    glas_putzen()\n    # und noch drei Schritte\n\n# und danach die Nacht\n`,
      hints:[
        `Zuerst die Gewohnheit und der Aufruf. Dann die Regel der Nacht: <code>while dunkel():</code>`,
        `Innerhalb der Nacht die Wahl: <code>if wind == "stark":</code> … <code>else:</code> …`,
        `Und jedes Mal zwei Kerne: <code>nacht = nacht - 1</code> (damit die Nacht zu Ende geht) und
         <code>vorrat = vorrat - 1</code> (weil Brennstoff verbrennt).`
      ],
      solution:`def leuchtturm_anzünden():
    glas_putzen()
    docht_richten()
    linse_drehen("norden")
    feuer_anzünden()

leuchtturm_anzünden()

while dunkel():
    if wind == "stark":
        docht_dämpfen()
    else:
        volles_licht()
    strahl_drehen()
    nacht = nacht - 1
    vorrat = vorrat - 1`,
      checks:[
        {r:`habit`, name:`leuchtturm_anzünden`}, {r:`uses`, what:`while`}, {r:`uses`, what:`if`},
        {r:`lit`}, {r:`calls`, what:`rotate`, min:6},
        {r:`jar`, name:`nacht`, is:0}, {r:`jar`, name:`vorrat`, is:0}
      ],
      trials:[{ label:`starker Wind`, world:{ wind:`stark` }, checks:[{r:`light`, is:`dim`}] }] },

    { t:`max`, p:[
      `Das Seltsamste ist: Ich habe nicht aufgehört, Angst zu haben. Ich war nur zu beschäftigt mit
       den Schritten, um mich davon ablenken zu lassen. Offenbar geht das auch.`
    ]},

    { t:`bridge`, pairs:[
      [`das ganze Programm`, `Skript`, `eine Datei, die der Computer von oben nach unten liest`],
      [`Gewohnheit innerhalb einer Regel`, `Verschachtelung`, `eins im anderen, über die Einrückungen`],
      [`Einrückung`, `indent`, `vier Leerzeichen — und Python versteht, dass es innen ist`]
    ], html:`Du hast gerade ein Programm mit drei Stockwerken geschrieben: eine Gewohnheit, die Regel
      der Nacht und die Wahl darin. Erwachsene Programme sind genauso gebaut — nur mit mehr
      Stockwerken.` }
  ]
});

/* ===================== EPILOG ===================== */
window.BOOK.chapters.push({
  id: `epilog`,
  num: `Epilog`,
  title: `Tsugi kommt zurück`,
  blocks: [
    { t:`story`, p:[
      `Tsugi kam am Morgen zurück, als sich das Meer des Feldes schon gelegt hatte. Er stieg die Treppe
       hinauf, setzte sich daneben und schaute lange — nicht auf den Strahl, sondern auf Max.`,
      `Dann wanderte sein Blick zur Fensterbank. Dort, wo immer zwei Gläser gestanden hatten, standen
       jetzt drei. Tsugi sah das dritte an — leer, mit einem vergessenen Kern auf dem Boden — und sagte
       nichts. Aber Max hätte schwören können, dass die Katze lächelte: Dieses Glas hatte es früher
       nicht gegeben. Es hatte sich jemand ausgedacht, der keine Lust mehr hatte, siebenundachtzig
       Stufen hinunterzulaufen.`,
      `Und Max verstand, was er die ganze Zeit nicht verstanden hatte. Tsugi hatte ihm nie gezeigt,
       wie man Code schreibt. Er hatte ihm gezeigt, wie er, Max, <em>schon immer denkt</em>.
       In Schritten. Ein Stück nach dem anderen. Nur hatte Max das vorher nicht bemerkt.`
    ]},
    { t:`pull`, html:`Er hat nicht gelernt, mit dem Leuchtturm zu reden. Er hat gelernt, so zu denken,
      dass man Großes und Bedrohliches Stück für Stück in die Hand nehmen kann. Und das funktionierte
      überall — nicht nur dort, wo es Code gibt.` },
    { t:`secret`, title:`🔎 Geheime Seite für Neugierige`, p:[
      `<em>(man übersieht sie leicht — sie steht ganz in der Ecke des Logbuchs, in winzigen Buchstaben)</em>`,
      `Weißt du noch, dass ich im ersten Kapitel gesagt habe: ein Name ohne Klammern tut nichts?
       Das stimmt. Für den Leuchtturm. Aber Zerberus ist kein Leuchtturm.`,
      `Schreib im Sandkasten ein einziges Wort — den Namen irgendeiner Tat, <strong>ohne Klammern</strong>.
       Sagen wir <code>feuer_anzünden</code>. Und starte.`,
      `Der Leuchtturm bleibt stumm, wie ich gesagt habe. Aber Zerberus hebt den Kopf.`,
      `<span class="mini">(er macht das in jedem Sandkasten dieses Buches. Du hast ihm nur vorher nie
       einen Anlass gegeben)</span>`
    ]},
    { t:`task`, id:`t7-1`, title:`Ein Leuchtturm, den es im Buch nicht gibt`,
      goal:`Jetzt bist du dran. Denk dir eine Gewohnheit aus, die im Buch nicht vorkam, und gib ihr
            einen eigenen Namen. Sie soll etwas mit dem Leuchtturm machen — und es ins Logbuch sagen.
            Eine richtige Antwort gibt es hier nicht: es gibt deine.`,
      sbTitle:`Eine freie Nacht`, ticks:6, fuel:12, night:true,
      code:`# dein Name, deine Schritte\n`,
      hints:[
        `Fang mit <code>def</code> und einem eigenen Namen an: <code>def mein_leuchtturm():</code> —
         und dann beliebige Befehle aus den Knöpfen oben.`,
        `Und vergiss zwei Dinge nicht: die Gewohnheit unten zu rufen und etwas mit
         <code>zeigen(…)</code> ins Logbuch zu schreiben. Alle Befehle stehen im Nachschlagewerk des
         <a href="sandbox.html">freien Sandkastens</a>.`
      ],
      checks:[{r:`uses`, what:`def`}, {r:`printed`}] },

    { t:`progress` },

    { t:`journal`, title:`Wörterbuch des Leuchtturms → Python`, blocks:[
      { t:`p`, html:`Diese Seite ist zum Mitnehmen. Links steht, wie wir hier geredet haben.
        Rechts dasselbe Wort, wie die Erwachsenen es nennen — und wie es in jedem anderen Buch über
        Code stehen wird.` },
      { t:`bridge`, pairs:[
        [`Befehl des Leuchtturms`,   `Funktion`,       `eine Tat, die einen Namen hat`],
        [`Klammern nach dem Namen`,  `Aufruf`,         `„tu das jetzt“`],
        [`zeigen(…)`,                `print(…)`,       `etwas ins Logbuch schreiben`],
        [`Glas`,                     `Variable`,       `ein Ort mit Aufschrift`],
        [`Aufschrift auf dem Glas`,  `Name der Variablen`, ``],
        [`leg hier hinein`,          `=`,              `Zuweisung`],
        [`gleich?`,                  `==`,             `Vergleich`],
        [`solange`,                  `while`,          `Schleife mit einer Frage`],
        [`geh bei jedem vorbei`,     `for … in …`,     `Schleife über eine Reihe`],
        [`falls / und wenn nicht / sonst`, `if / elif / else`, `die Wahl eines Zweigs`],
        [`Gewohnheit`,               `def`,            `eine Funktion, die du selbst schreibst`],
        [`Fenster`,                  `Parameter`,      `das, was man in den Klammern mitgibt`],
        [`sagt`,                     `return`,         `gibt eine Antwort zurück`],
        [`Einrückung`,               `indent`,         `vier Leerzeichen — „das ist innen“`],
        [`Reihe`,                    `Liste (list)`,   `mehrere Dinge hintereinander`]
      ], html:`Wenn du irgendein Erwachsenenlehrbuch über Python aufschlägst — die rechte Spalte kennst
        du schon. Du musst dich nur noch daran gewöhnen, dass sie englisch ist.` }
    ]},

    { t:`journal`, title:`Zum Schluss — für dich`, blocks:[
      { t:`p`, html:`Es ging hier nicht um Python. Also, um Python auch. Aber das ist nicht die
        Hauptsache.` },
      { t:`p`, html:`Die Hauptsache ist die: Du kannst jetzt <strong>in Schritten denken</strong>.
        Großes in Kleines zerlegen. Muster bemerken. Den Dingen Namen geben, damit sie gehorchen.
        Ein Glas dort aufstellen, wo man sonst jedes Mal siebenundachtzig Stufen laufen müsste.
        Einen Moment innehalten, bevor man antwortet.` },
      { t:`p`, html:`Und noch etwas, das Nützlichste: Wenn etwas nicht läuft — nicht alles neu
        schreiben, sondern lesen, die Zeile finden und eine Sache ändern.` },
      { t:`p`, html:`Probier das an etwas aus, das überhaupt nichts mit Computern zu tun hat.
        Und schau, was passiert.` },
      { t:`small`, html:`Und wenn du es irgendwann machst — erzähl es mir. Ich bin Max. Ich probiere
        auch immer noch.` }
    ]},
    { t:`cta`, href:`sandbox.html`, text:`Den freien Sandkasten öffnen →` }
  ]
});
