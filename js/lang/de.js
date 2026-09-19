/* ==========================================================================
   lang/de.js — die deutsche Sprache des Buches.

   Hier steht alles, was das Buch in Worten sagt: die Python-Befehle, die das
   Kind selbst tippt, die Beschriftungen der Oberfläche, die Stimme des
   Leuchtturms in Fehlern und Hinweisen. Der Motor (runtime.js, tasks.js,
   book.js) kennt kein einziges Wort — er holt sie von hier.
   ========================================================================== */
window.LANGS = window.LANGS || {};

window.LANGS.de = {
  code: 'de',
  htmlLang: 'de',
  name: 'Deutsch',
  short: 'DE',

  /* ---------------------------------------------------------------------
     py — die Wörter, mit denen das Kind mit dem Leuchtturm spricht.
     Daraus baut sich der Python-Prolog, die Tastenpalette und jeder Hinweis.
     --------------------------------------------------------------------- */
  py: {
    fn: {
      clean:'glas_putzen', trim:'docht_richten', lens:'linse_drehen',
      ignite:'feuer_anzünden', full:'volles_licht', dim:'docht_dämpfen',
      rotate:'strahl_drehen', water:'wasser_geben', print:'zeigen',
      dark:'dunkel', guest:'gast_auf_dem_pfad', count:'zählen'
    },
    jar:  { night:'nacht', fuel:'vorrat', cans:'kanister' },
    name: { wind:'wind', row:'reihe', sunflower:'sonnenblume', times:'mal',
            dir:'richtung', what:'was', own:'name' },
    val:  { north:'norden', path:'pfad', strong:'stark', calm:'still',
            yes:'ja', no:'nein', nothing:'nichts' },
    rowItems: ['Sonnenblume 1', 'Sonnenblume 2', 'Sonnenblume 3'],

    doc: {
      stop: 'Von eigener Hand gestoppt: kein Fehler des Kindes, sondern die Bremse des Leuchtturms.',
      jars: 'In die Gläser auf der Fensterbank schauen und sie am Leuchtturm zeigen.',
      dark: 'Schaut nur in das Glas „nacht“ und antwortet ja oder nein.\n' +
            '    Selbst ändert es gar nichts: die Nacht wird nur kürzer,\n' +
            '    wenn du selbst einen Kern herausnimmst.',
      word: 'Der Leuchtturm spricht Deutsch — auch bei „ja“ und „nein“.'
    }
  },

  palette: [
    { grp:'Befehle',       keys:['clean','trim','lens','ignite','full','dim','rotate','water','print'] },
    { grp:'Gläser',        keys:['jarNight','jarFuel','jarCans'] },
    { grp:'Regeln',        keys:['while','for','if','else','def'] }
  ],

  /* ---------------------------------------------------------------------
     Seiten
     --------------------------------------------------------------------- */
  meta: {
    bookTitle: 'Max und der Code des Leuchtturms',
    brand: '🗼 Max und der Code des Leuchtturms',
    brandShort: '🗼 Leuchtturm-Code',
    indexTitle: 'Max und der Code des Leuchtturms',
    indexDesc: 'Die Geschichte eines Jungen, der allein einen Leuchtturm hüten muss — und dabei ' +
               'lernt, so zu denken, wie Code denkt. Mit echtem Python zum Ausprobieren.',
    sandboxTitle: 'Der Sandkasten des Leuchtturms',
    sandboxDesc: 'Freier Sandkasten: schreib echten Code mit deutschen Befehlen und sieh zu, ' +
                 'wie der Leuchtturm lebendig wird.',
    adultTitle: 'Für Erwachsene · Max und der Code des Leuchtturms',
    adultDesc: 'Was dieses Buch wirklich beibringt: fünf Gewohnheiten algorithmischen Denkens, ' +
               'wie man es mit dem Kind liest, was man nicht erwarten sollte, Alter und Technik.',
    footer: 'Max, Tsugi und Zerberus · das Licht des Leuchtturms'
  },

  nav: {
    adult: 'Für Erwachsene',
    chapters: 'Kapitel',
    sandbox: 'Sandkasten',
    backToBook: '← Zum Buch',
    langLabel: 'Sprache des Buches'
  },

  gate: {
    title: 'Das Licht des Leuchtturms',
    lead: 'Die Tür des Leuchtturms ist zu. Gib den Schlüssel-Gutschein ein, um ins Buch zu kommen.',
    leadShort: 'Die Tür des Leuchtturms ist zu. Gib den Schlüssel-Gutschein ein.',
    placeholder: 'Gutschein',
    aria: 'Schlüssel-Gutschein',
    button: 'Aufschließen',
    mini: 'Der Schlüssel liegt dem Buch beim Kauf bei.',
    openLink: 'Sie sind erwachsen und haben das Buch noch nicht gekauft?<br>' +
              'Die Seite „Für Erwachsene“ ist offen →',
    ok: 'Der Schlüssel passt. Die Tür geht auf …',
    no: 'Tsugi sagt: Dieser Schlüssel passt nicht. Versuch es noch einmal.'
  },

  hero: {
    title: 'Max und der Code des Leuchtturms',
    lead: 'Die Geschichte eines Jungen, der allein einen Leuchtturm hüten muss — und dabei lernt, ' +
          'so zu denken, wie Code denkt. Lies — und mach den Leuchtturm dann mit eigenen Händen an.',
    alt: 'Ein Leuchtturm bei Nacht über einem Sonnenblumenfeld'
  },

  adultPage: {
    lead: 'Ab hier spricht das Buch mit Max’ eigener Stimme.',
    cta: 'Zum Buch →',
    mini: 'Das Buch öffnet sich mit dem Schlüssel-Gutschein, der beim Kauf dabei ist.'
  },

  sandboxPage: {
    title: 'Der Sandkasten des Leuchtturms',
    intro: 'Hier darfst du alles schreiben. Stell das Wetter ein, drück „Starten“ — und der ' +
           'Leuchtturm wird lebendig. Mach so viele Fehler, wie du willst: der Leuchtturm sagt ' +
           'dir in aller Ruhe, was nicht stimmt.',
    sbTitle: 'Schreib, was du willst',
    seed:
`# Probier es aus! Zünde zum Beispiel den Leuchtturm an, dreh den Strahl
# ein paar Mal und gieß einen Kanister Petroleum aus dem Lager nach.

def leuchtturm_anzünden():
    glas_putzen()
    docht_richten()
    linse_drehen("norden")
    feuer_anzünden()

leuchtturm_anzünden()

while dunkel():
    strahl_drehen()
    nacht = nacht - 1

kanister = kanister - 1
vorrat = vorrat + 4
zeigen("Kanister im Lager:", kanister, "· Nächte Licht:", vorrat)
zeigen("fertig")`,
    doc: `
      <h3>Die Befehle des Leuchtturms</h3>
      <p><strong>Taten (sie tun etwas):</strong></p>
      <ul>
        <li><code>glas_putzen()</code> — das Glas vorbereiten</li>
        <li><code>docht_richten()</code> — den Docht vorbereiten</li>
        <li><code>linse_drehen("norden")</code> — die Linse in eine Richtung drehen</li>
        <li><code>feuer_anzünden()</code> — den Leuchtturm anzünden</li>
        <li><code>volles_licht()</code> — mit voller Kraft leuchten</li>
        <li><code>docht_dämpfen()</code> — das Licht dämpfen</li>
        <li><code>strahl_drehen()</code> — den Strahl einen Schritt weiterdrehen</li>
        <li><code>wasser_geben(sonnenblume)</code> — eine Sonnenblume gießen</li>
        <li><code>zeigen(etwas)</code> — etwas ins Logbuch schreiben</li>
      </ul>
      <p><strong>Fragen und Zählen (sie antworten etwas):</strong></p>
      <ul>
        <li><code>dunkel()</code> — ob im Glas „nacht“ noch Kerne liegen. Selbst ändert es nichts:
            die Nacht wird nur kürzer, wenn du selbst <code>nacht = nacht - 1</code> schreibst</li>
        <li><code>gast_auf_dem_pfad()</code> — ob ein Gast kommt (hängt vom Wetter ab)</li>
        <li><code>zählen(reihe)</code> — wie viele in der Reihe stehen</li>
      </ul>
      <p><strong>Die Gläser auf der Fensterbank (Zahlen, die du ändern darfst):</strong></p>
      <ul>
        <li><code>nacht</code> — wie viele Drehungen bis zum Morgen bleiben (am Anfang 6)</li>
        <li><code>vorrat</code> — wie viele Nächte Brennstoff noch in der Lampe sind</li>
        <li><code>kanister</code> — wie viele Kanister Petroleum im Lager warten
            (ein Kanister — vier Nächte)</li>
      </ul>
      <p class="small">Die Gläser stehen neben dem Leuchtturm: so viele Kerne, so viel ist übrig.
      Herausnehmen — <code>vorrat = vorrat - 1</code>. Nachfüllen — <code>vorrat = vorrat + 4</code>.</p>
      <p><strong>Fertige Dinge:</strong></p>
      <ul>
        <li><code>wind</code> — wie das Wetter ist ("stark" oder "still")</li>
        <li><code>reihe</code> — die Reihe Sonnenblumen, durch die man mit <code>for</code> gehen kann</li>
      </ul>
      <p class="small">Auch das gewöhnliche Python funktioniert: <code>if</code>, <code>while</code>,
      <code>for</code>, <code>def</code>, <code>return</code>, <code>range()</code>, Zahlen, Wörter.</p>
      <p><strong>Die Regel jeder Schleife:</strong></p>
      <p class="small">In <code>while dunkel():</code> muss innen
      <code>nacht = nacht - 1</code> stehen. Sonst wird das Glas „nacht“ nie leer, und die Schleife
      dreht sich ohne Ende — dann hält Tsugi dich an und sagt es dir.</p>
      <p class="small">Und wenn du den Namen einer Tat <em>ohne</em> Klammern schreibst, bleibt der
      Leuchtturm stumm — dafür meldet sich Zerberus.</p>`
  },

  /* ---------------------------------------------------------------------
     Sandkasten
     --------------------------------------------------------------------- */
  sb: {
    defaultTitle: 'Logbuch des Leuchtturms — Sandkasten',
    taskTitle: 'Probier es selbst',
    paletteSummary: 'Befehle des Leuchtturms — tippen, und die Zeile steht von allein da',
    run: '▶ Starten',
    running: '…',
    reset: '↺ Von vorn',
    shortcut: 'Strg + Enter',
    editorAria: 'Code für den Leuchtturm',
    consoleIdle: 'Drück „Starten“, damit der Leuchtturm lebendig wird.',
    weatherAria: 'Wetter',
    weatherStorm: 'Wetter: starker Wind',
    weatherGuest: 'Wetter: Gast auf dem Pfad',
    weatherCalm: 'Wetter: Stille',
    waking: 'Der Leuchtturm wacht auf … (beim ersten Mal dauert es ein paar Sekunden)',
    noPython: 'Der Leuchtturm ließ sich nicht wecken (kein Internet, um Python zu laden).',
    lit: '✔ Der Leuchtturm leuchtet.',
    done: 'Fertig.',
    stumbled: (msg) => 'Der Leuchtturm ist gestolpert: ' + msg,
    verdictMore: 'Fast — es fehlt noch:',
    praise: [
      'Geschafft! Der Leuchtturm hat auf dich gehört.',
      'Genau so. Der Leuchtturm leuchtet, wie du es gesagt hast.',
      'Ja! Genau das wollten wir.',
      'Erledigt. Tsugi hätte anerkennend geblinzelt.',
      'Der Leuchtturm hat alles beim ersten Mal verstanden. Das passiert nicht immer — freu dich.'
    ],
    fixErrorFirst: 'Sorg erst dafür, dass der Code ohne Fehler läuft — der Hinweis steht schon oben im Logbuch.',
    trialCrash: (label) => `Beim Wetter „${label}“ ist der Code gestolpert.`,
    trialNote:  (label, note) => `Wenn „${label}“: ${note}`
  },

  /* ---------------------------------------------------------------------
     Die Stimme des Leuchtturms, wenn etwas nicht stimmt
     --------------------------------------------------------------------- */
  err: {
    endless: 'Tsugi sagt: Diese Schleife dreht sich und dreht sich, und ein Ende ist nicht in Sicht. ' +
             'Innen muss etwas stehen, das dem Ende Stück für Stück näher kommt — zum Beispiel ' +
             '„nacht = nacht - 1“.',
    emptyBlock: 'Nach dem Doppelpunkt ist es innen leer. Dort muss mindestens ein Schritt stehen, ' +
                'nach rechts eingerückt (ein Kommentar zählt nicht).',
    syntax: 'Da ist wohl ein Zeichen verloren gegangen — vielleicht eine Klammer oder ein Doppelpunkt. ' +
            'Schau dir die Zeile genau an.',
    indentation: 'Diese Zeile steht nicht an ihrem Platz. Denk dran: was innen ist, ist um einen ' +
                 'Schritt nach rechts gerückt (die Einrückung).',
    nameNear: (nm, near) => `Der Leuchtturm kennt das Wort „${nm}“ nicht. Sollte da vielleicht „${near}“ stehen?`,
    nameFar:  (nm) => `Der Leuchtturm kennt das Wort „${nm}“ nicht. Such nach einem Tippfehler — ` +
                      `oder gib der Sache einen Namen, bevor du sie rufst.`,
    type: 'Dieser Befehl hat etwas anderes bekommen, als er erwartet hat. Prüf, was genau in den Klammern steht.',
    zeroDiv: 'Durch null darf man nicht teilen — nicht einmal ein Leuchtturm. Nimm eine andere Zahl.',
    recursion: 'Die Gewohnheit hat sich selbst gerufen — und das ohne Ende. Prüf, ob sie eine Stelle hat, ' +
               'an der sie anhält.',
    fallback: 'Irgendetwas ist schiefgelaufen. Versuch es noch einmal — das ist ganz normal.',
    cerberus: (name) =>
      `\u{1F415} Zerberus hebt den Kopf: „Das ist der Name einer Tat — ‚${name}‘. Von allein tut er gar nichts. ` +
      `Wenn du willst, dass es passiert, häng Klammern dran: ${name}().“`
  },

  /* ---------------------------------------------------------------------
     Der Leuchtturm auf dem Bildschirm
     --------------------------------------------------------------------- */
  view: {
    off: 'aus',
    on: 'an',
    full: 'voll',
    dim: 'gedämpft',
    statusLight: 'Licht',
    statusLens: 'Linse zeigt nach',
    jarTitle: (name) => `Glas „${name}“`
  },

  /* ---------------------------------------------------------------------
     Das Buch: Beschriftungen der Bausteine
     --------------------------------------------------------------------- */
  book: {
    /* Beschriftungen, die nur im Manuskript vorkommen (tools/manuscript.mjs) */
    bridgeOurs: 'im Buch',
    bridgeTheirs: 'in der großen Welt',
    manuscript: 'Manuskript',
    contents: 'Inhalt',
    generatedFrom: 'Diese Datei wurde erzeugt aus',
    editBack: 'Änderungen daran müssen zurück in den Buchtext übertragen werden.',
    sandbox: 'Sandkasten',
    maxNote: '🖊 aus Max’ Logbuch',
    taskTag: 'Aufgabe',
    fixTag: 'Repariere',
    doneLabel: 'erledigt',
    hint: 'Hinweis',
    solution: 'Ins Logbuch des Wärters spicken',
    appliedTag: 'Im Leben',
    gistLabel: 'Kurz gesagt',
    bridgeTag: 'Wie das in der großen Welt heißt',
    debugTag: 'Wenn es nicht läuft',
    noBook: 'Der Text des Buches wurde nicht gefunden.',
    loadFail: 'Das sieht nicht nach einem Logbuch des Leuchtturms aus.',
    progress: {
      title: 'Logbuch der Aufgaben',
      count: (done, total) => `Geschafft: <b>${done}</b> von <b>${total}</b>.`,
      groupCode: 'Was in den Leuchtturm geschrieben wird',
      groupLife: 'Was außerhalb des Bildschirms passiert',
      save: '↓ Logbuch als Datei sichern',
      load: '↑ Aus Datei zurückholen',
      note: 'Das Logbuch merkt sich alles in diesem Browser. Öffnest du das Buch an einem anderen ' +
            'Computer, fangen die Sterne von vorn an. Damit sie mitkommen, sichere das Logbuch als ' +
            'Datei und hol es dort zurück.',
      file: 'leuchtturm-logbuch.json'
    }
  },

  /* ---------------------------------------------------------------------
     Die Prüfung der Aufgaben
     --------------------------------------------------------------------- */
  checks: {
    actions: {
      clean:'das Glas putzen', trim:'den Docht richten', lens:'die Linse drehen',
      ignite:'das Feuer anzünden', full:'volles Licht', dim:'den Docht dämpfen',
      rotate:'den Strahl drehen', water:'Wasser geben'
    },
    lights: { ignite:'gewöhnlich', full:'voll', dim:'gedämpft' },
    patterns: {
      while:'<code>while</code>', for:'<code>for</code>', def:'<code>def</code>',
      if:'<code>if</code>', elif:'<code>elif</code>', else:'<code>else</code>',
      return:'<code>return</code>', range:'<code>range()</code>',
      param:'ein Fenster für eine Zahl (Parameter)'
    },
    notLit: (ignite) => `Der Leuchtturm ist nie angegangen. Schau, ob am Ende <code>${ignite}()</code> steht.`,
    orderMixed: (chain) => `Die Schritte sind durcheinander. Versuch es der Reihe nach: ${chain}.`,
    orderMissing: (name) => `Der Schritt „${name}“ fehlt. Schau auf die Liste im Logbuch.`,
    callsMin: (name, n, min) => `„${name}“ ist ${n}-mal passiert, nötig sind aber mindestens ${min}.`,
    callsMax: (name, n, max) => `„${name}“ ist ${n}-mal passiert — das ist schon zu viel, höchstens ${max}.`,
    lensNone: (lens, to) => `Die Linse hat niemand gedreht. Versuch <code>${lens}("${to}")</code>.`,
    lensWrong: (got, want) => `Die Linse zeigt nach „${got}“, nötig ist aber „${want}“.`,
    lightNone: 'Das Licht hat sich gar nicht verändert.',
    lightWrong: (got, want) => `Am Ende ist das Licht ${got}, bei diesem Wetter muss es ${want} sein.`,
    jarMissing: (name) => `Das Glas „${name}“ ist nirgends zu sehen. Heißt es wirklich genau so?`,
    jarIs:  (name, v, is)  => `Im Glas „${name}“ sind ${v} übrig, es sollten aber ${is} sein.`,
    jarMin: (name, v, min) => `Im Glas „${name}“ sind ${v} übrig — zu wenig, nötig sind mindestens ${min}.`,
    jarMax: (name, v, max) => `Im Glas „${name}“ sind ganze ${v} — zu viel, höchstens ${max}.`,
    printedEmpty: (print) => `Das Logbuch ist leer. Sag dem Leuchtturm <code>${print}(…)</code>.`,
    printedLike: (like) => `Im Logbuch steht das Wort „${like}“ nicht. Worum genau bittest du?`,
    usesNeed: (name) => `Hier brauchst du ${name}. Ohne das schafft es der Leuchtturm — du aber nicht 🙂`,
    habitMissing: (name) => `Ich sehe keine Gewohnheit mit dem Namen <code>${name}</code>. ` +
                            `So kündigt man sie an: <code>def ${name}():</code>`,
    habitNotCalled: (name) => `Die Gewohnheit <code>${name}</code> ist geschrieben, aber kein einziges Mal ` +
                              `gerufen. Schreib eine eigene Zeile dazu: <code>${name}()</code>`,
    newJar: 'Von deinem eigenen Glas ist auf der Fensterbank nichts zu sehen. Denk dir eine Aufschrift ' +
            'aus und leg eine Zahl hinein — zum Beispiel <code>holz = 5</code>.',
    notUses: (what) => `Hier kommst du besser ohne <code>${what}</code> aus.`,
    atMostLines: (n, max) => `Ganze ${n} Zeilen. Dasselbe geht kürzer — mit höchstens ${max}.`,
    watered: (n, min) => `Wasser haben ${n} Sonnenblume(n) bekommen, in der Reihe stehen aber ${min}. ` +
                         `Lass keine aus.`
  }
};
