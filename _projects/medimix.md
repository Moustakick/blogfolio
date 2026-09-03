---
title: "MEDIMIX : Imagerie médicale et réalité mixte"
role: "Recherche & développement"
category: "Recherche/Informatique"
summary: "Projet de visualisation médical en réalité mixte."
tags: [3D, AR, VR, R&D, Cours]
image: assets/images/projects/medimix/models.png
---

En 2024, dans le cadre de mon Projet de Fin d’Études au LaBRI, à l'Université de Bordeaux, j’ai travaillé sur une application que nous appellerons MEDIMIX, un projet consacré à l’utilisation de la réalité mixte pour l’exploration de données d’imagerie médicale.

L’idée de départ est assez intuitive : les scanners et IRM permettent de reconstruire des structures anatomiques en 3D, mais ces données sont encore très souvent consultées sur des écrans 2D. On perd alors une partie de l’information spatiale. Nous avons donc cherché à exploiter le Meta Quest 3 pour manipuler directement ces modèles 3D dans l’espace réel, grâce au passthrough du casque.

L’application a été développée sous Unity, avec OpenXR, afin de conserver une architecture autonome et compatible avec différents équipements de réalité étendue. L'un des objectifs était notamment de s'affranchir des solutions nécessitant un PC intermédiaire ou des logiciels propriétaires.

Nous avons développé deux approches complémentaires pour alimenter l’environnement 3D. La première permet de charger directement des modèles OBJ, récupérés de manière asynchrone depuis une URL ou un serveur de fichiers SMB, sans avoir à les stocker préalablement sur le casque. La seconde repose sur OpenIGTLink et permet de connecter directement l’application à 3D Slicer. Une segmentation réalisée dans Slicer peut ainsi être transformée en maillage puis transmise au Meta Quest 3 pour être reconstruite et affichée en temps réel.

Autour de ces deux systèmes, j’ai également travaillé sur le socle d’interaction XR : interface attachée à la main, clavier virtuel, suivi des mains et des contrôleurs, manipulation des modèles en trois dimensions, ainsi que la possibilité de passer instantanément d'une expérience de réalité virtuelle à une expérience de réalité mixte. Une console de débogage permet notamment de suivre les caractéristiques des modèles chargés, comme le nombre de sommets ou de polygones.

Une partie importante du projet a également consisté à déterminer les limites du casque. Nous avons testé l'application avec des maillages allant de quelques centaines de faces à plusieurs millions. Les modèles de moins de 500 000 faces restent très fluides sur le Quest 3, tandis que les performances commencent à devenir réellement contraignantes au-delà de plusieurs millions de faces. Cela met notamment en évidence l'importance de la simplification des maillages issus de segmentations complexes avant leur utilisation en réalité mixte.

Le résultat final est une solution permettant de visualiser, transmettre et manipuler des modèles anatomiques 3D directement depuis un casque autonome, avec deux modes d'alimentation des données et une architecture entièrement open-source. Le projet ouvre notamment la voie à l'ajout d'autres formats 3D, au rendu volumique, à l'affichage de plans de coupe et, à terme, à la manipulation collaborative de modèles sur plusieurs casques.

Source : Non disponible.

![Visualisation du lien PC -> AR]({{ "assets/images/projects/medimix/link.png" | relative_url }})

*Exemple de visualisation de la projection AR du logiciel 3D Slicer vers notre solution*