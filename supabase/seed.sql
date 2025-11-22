INSERT INTO public.assessment_questions (id, question, answers, correct_answer_index)
VALUES
    (0, 'Predstavljajte si, da nekdo vloži [€100] na varčevalni račun z zagotovljeno obrestno mero 2% na leto. Ne vplačuje dodatnega denarja na ta račun in ne dviguje denarja. Koliko denarja bi bilo na računu po petih letih?', ARRAY[
        'Več kot [€110]',
        'Natanko [€110]',
        'Manj kot [€110]',
        'Ne vem'
    ], 0),
    (1, 'Sedaj si predstavljajte naslednjo situacijo. Čez eno leto boste prejeli darilo [€1.000] in v tem letu bo inflacija ostala na 2%. Čez eno leto boste z [€1.000] lahko kupili:', ARRAY[
        'Več kot lahko kupite danes',
        'Enako količino',
        'Manj kot lahko kupite danes',
        'Ne vem'
    ], 2),
    (2, 'Če se obrestne mere zvišajo, kaj se bo običajno zgodilo s cenami obveznic?', ARRAY[
        'Zvišale se bodo',
        'Znižale se bodo',
        'Ostale bodo enake, ker ni povezave med cenami obveznic in obrestno mero',
        'Ne vem'
    ], 1),
    (3, 'Katera od naslednjih trditev je pravilna? Naložba z višjim donosom je verjetno:', ARRAY[
        'Bolj tvegana kot naložba z nižjim donosom',
        'Manj tvegana kot naložba z nižjim donosom',
        'Enako tvegana kot naložba z nižjim donosom',
        'Ne vem'
    ], 0),
    (4, 'Naložba v širok spekter "delnic podjetij" je verjetno:', ARRAY[
        'Bolj tvegana kot naložba v eno delnico',
        'Manj tvegana kot naložba v eno delnico',
        'Enako tvegana kot naložba v eno delnico',
        'Ne vem'
    ], 1),
    (5, 'Kaj je diverzifikacija?', ARRAY[
        'Vse v eno naložbo',
        'Razpršitev med različne naložbe',
        'Vlaganje samo v tujino',
        'Le nepremičnine'
    ], 1 ),
    (6, 'Kaj je inflacija?', ARRAY[
        'Znižanje cen',
        'Vrednost denarja raste',
        'Splošna rast cen',
        'Rast plač'
    ], 2),
    (7, 'Katera možnost je običajno naložba z nizkim tveganjem?', ARRAY[
        'Delnice podjetij',
        'Varčevalni račun',
        'Kriptovalute',
        'Trgovanje z opcijami'
    ], 1),
    (8, 'Kaj je proračun (budget)?', ARRAY[
        'Načrt za posojilo',
        'Zapis preteklih stroškov',
        'Načrt prihodkov in izdatkov',
        'Pogodba z banko'
    ], 2),
    (9, 'Kaj pomeni obrestno-obrestni račun (compound interest)?', ARRAY[
      'Obresti le na začetni znesek',
      'Obresti samo na koncu',
      'Obresti na glavnico + obresti',
      'Obresti se ne spreminjajo'
    ], 2),
    (10, 'Kaj je glavni namen rezervnega sklada (emergency fund)?', ARRAY[
        'Visokotvegane naložbe',
        'Počitnice',
        'Nepričakovani stroški',
        'Luksuzni nakupi'
    ], 2),
    (11,  'Katera trditev najbolje opisuje delnico?', ARRAY[
        'Zagotovljen donos',
        'Posojilo podjetju',
        'Lastništvo dela podjetja',
        'Denar v banki'
    ], 2),
    (12,  'Za kaj se uporablja kazalnik P/E (price-to-earnings)?', ARRAY[
        'Merjenje inflacije',
        'Ocena vrednotenja delnice',
        'Določanje obrestnih mer',
        'Izračun davkov'
    ], 1),
    (13, 'Kateri dejavnik ima največji dolgoročni vpliv na rast naložb?', ARRAY[
        'Davki',
        'Inflacija',
        'Market timing',
        'Čas, ko je denar naložen'
    ], 3),
    (14, 'Kaj je vzajemni sklad (mutual fund)?', ARRAY[
        'Bančni račun',
        'Podjetje, ki zavaruje naložbe',
        'Skupni portfelj vlagateljev',
        'Državno zagotovilo'
    ], 2);
