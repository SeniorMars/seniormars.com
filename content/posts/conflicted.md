+++
title = "I am conflicted by current Mathematics"
date = "2025-12-26"
description = "A guy is conflicted by Mathematics."

[extra]
comment = true
read_time = true

[taxonomies] 
tags=["math", "ethics", "academia"] 
+++

# Motivation

For the last three months, I've been preparing applications to graduate schools in Mathematics. The process has forced me to ask questions I've been avoiding: do I actually want to commit the next five to seven years of my life to this field? Not just the mathematics itself (I love that part) but the culture, the institutions, the unspoken rules that govern who gets to do mathematics and how we talk about what mathematics even is.

This post is an attempt to articulate my conflicted feelings; maybe get some answers from people who've thought about these things longer than I have. What follows is filled with anecdotal observations and personal experiences, so take it with however many grains of salt you need. But I hope it sparks something worth discussing.


# The culture of Mathematics

One of the PhD programs I'm applying to lists where their current graduate students did their undergraduate work. I went through the list, then looked up their profiles. The pattern was immediate: top-tier universities, nearly all of them. MIT, Harvard, Berkeley, a few international equivalents; maybe one or two state schools if you squint. I go to Rice, which has a solid math program: I can take graduate courses as an undergrad, work with professors on research. I'm extremely lucky. But scrolling through those names made something sit wrong in my stomach, and it's not just me being insecure about my chances. I can't prove this, but I find it hard to believe that someone from a "weaker" school would implcitly have less mathematical ability than these students. So why does the list look like this?

I found the people who end up at top undergraduate programs tend to have done serious mathematics in high school. Many competed in olympiads, attended elite summer programs, had access to university-level material before they turned seventeen. This creates what looks like meritocracy but functions more like a pipeline. The students who discover mathematics later, or come from schools without advanced math offerings, or didn't have parents who knew these opportunities existed --- they start disadvantaged the system never lets them close. Many hobbies are like this, but mathematics is just one I feel is particularly stark about. I'm not even talking about the idea of a child genius, though that exists too.

Here's the thing: this isn't about individual students being talented or hardworking. It's about how the field has built a self-perpetuating cycle that selects for access rather than ability. The olympiad kids had olympiad coaching; the coaching started in middle school; the middle school programs required parents who knew they existed and could afford the time and money to support them. By the time someone reaches graduate admissions, we're looking at the result of a decade-long filtering process that has nothing to do with mathematical potential and everything to do with circumstances of birth. I understand I'm oversimplifying, but I went to Stuyvesant High School, a school filled with extremely strong math individuals, and I saw this pattern play out in real life multiple times. Only after seriously engaging with math did I realize how privileged my own path had been even when I didn't "do math stuff" in high school.

Even more troubling: I've noticed another pattern. Students from small liberal arts colleges, even excellent ones, seem to have a harder time getting into top graduate programs compared to students from research universities. The liberal arts students might have the same level of passion and preparation, but they lack something quantifiable that admissions committees trust. Maybe it's research experience at the frontier; maybe it's letters from famous mathematicians; maybe it's just name recognition. The result is that many liberal arts students, unless they're exceptionally exceptional, end up filtered out of the top tier of graduate programs.

Here's what bothers me: many liberal arts colleges are women's colleges, HBCUs, or other minority-serving institutions. By favoring students from prestigious research universities, even unintentionally, graduate admissions may be indirectly reducing diversity in mathematics. I don't have hard data on this, but it seems worth asking whether the selection mechanisms we use encode biases about race, gender, and class through the proxy of undergraduate institution.

Computer science has made visible efforts in the last decade to reach underrepresented groups through programs, scholarships, explicit diversity initiatives. Mathematics has been around much longer; such efforts seem less prevalent, less systematic, less central to how the field thinks about itself. I find myself wondering if mathematics is resistant to change or if there are structural reasons this is harder in math than in CS. Either way, the relative lack of progress is striking.

# Mathematics and subjectivity

This will sound absurd coming from someone who's taken real analysis and studied the foundations' crisis of the early twentieth century, but I'm troubled by how mathematics presents itself as the shining example of objective science. Yes, I know we had to rebuild the foundations after paradoxes threatened the whole edifice. Yes, I know Gödel showed us incompleteness; we survived. But the way mathematics gets taught in academia often glosses over the subjective choices embedded in what we do.

Most mathematicians work in ZFC set theory without ever explicitly saying so. We talk about "the universe" of sets but never define what that phrase means rigorously. The foundations are assumed to be consistent because they've held up so far, not because we've proven they're safe: we literally cannot prove ZFC is consistent from within ZFC itself. In my opinion, that's the entire field resting on "well, nothing's broken yet." We can get arbitrarily far from foundational questions because most mathematicians don't care. The working mathematician doesn't lose sleep over whether ZFC might harbor a contradiction. We proceed as if the foundations are settled when they're really just accepted.

There are theorems that make the subjectivity explicit. Joel David Hamkins proved that there exists a universal algorithm, a Turing machine capable of computing any desired function, provided you run it in the right model of arithmetic. Which "right model" you pick changes what's computable. In this setting subjectivity isn't a technicality, but a choice about what mathematical universe you inhabit, and different choices give different answers to questions that look purely mathematical.

We could have chosen homotopy type theory instead of ZFC as our foundation. HoTT would still be valid mathematics, just different mathematics. The fact that we picked one foundation over another reflects historical contingency, aesthetic preference, and practical utility --- we have been using ZFC for years. Yet we teach mathematics as if the structures we study exist independently of these choices. And I know we have some good reasons for this, but still it feels like a glossing over of important philosophical issues.

Yes, our proofs and theorems are truths; I'm not disputing that. But at a grander scale, it strikes me as almost funny how we claim to be the shining example of science without acknowledging some crucial details. You can argue that everything reduces to axioms and we're just exploring consequences, fine. But which axioms we choose, which logical framework we work in, whether we accept the law of excluded middle or work constructively --- these are subjective decisions that shape what counts as mathematics. The subjectivity is everywhere once you start looking for it. 

Every so often, I watch mathematicians criticize social sciences for being subjective, for not having the rigor of mathematics. The irony is that mathematics has its subjectivity; we've just convinced ourselves it doesn't count.

Consider the Dirac delta function. Physicists used it productively for nearly two decades before we provided rigorous foundations. In this case, intuition ran ahead of formalization, and the formalization eventually caught up. Ramanujan's work showed the same pattern: results that seemed nonsensical under the standards of his time turned out to be correct when we developed the right framework to understand them. In these two cases, the demand for proof blocks mathematical progress. I understand why we need proofs. I really do, but the insistence on formalization before acceptance has costs we don't always count.

Even our current formalization efforts run into these issues. Proof assistants like Lean require choosing whether to use the law of excluded middle, whether to work constructively, whether to use cubical methods for homotopy type theory. These may be implementation details, but end up being philosophical commitments that affect what theorems you can state and prove (for instance fomralizing temporal logic in lean is difficult). Different proof assistants make different choices, and while that might be interesting, it undercuts the narrative that mathematics is a single objective edifice.

The broader problem, I think, is that we may be creating a culture where the general public are afraid to criticize mathematicians. We treat mathematics as hard, exclusive, requiring special talent. Combined with the assumption of objectivity, this makes mathematical authority almost unquestionable. But mathematicians make mistakes --- our proofs have errors, our definitions need revision, our intuitions mislead us. The mythology of objectivity makes it harder to have those conversations honestly.

# The ethics of Mathematics

I'm also a linguistics major, which means I notice things about language and naming that maybe pure math people don't. Take the name "algorithm." It's based on the Latinization of محمد بن موسى الخوارزميّ, the Persian mathematician who wrote foundational texts on algebra and arithmetic in the ninth century. His name got corrupted through Latin into something that sounds European; most people learning about algorithms have no idea they're named after a Muslim scholar from Baghdad.

This is part of a broader pattern. Mathematics has uncredited work everywhere, especially from non-Western cultures. The number system we use daily came from India; the concept of zero as a number, not just a placeholder, came from Indian and later Islamic mathematics. Yet we don't teach the history of mathematics in a way that makes these contributions visible. We name theorems after Western mathematicians; we teach a narrative where real mathematics started with the Greeks and resumed with the Europeans.

Even when we do credit people, we sometimes get it wrong in ways that reflect power dynamics. Hyperbolic geometry was discovered independently by Gauss, Lobachevsky, and Bolyai, but Gauss was already famous and didn't publish his work. Lobachevsky and Bolyai get more credit, but often the narrative erases how close Gauss was to the same ideas. The history gets simplified into priority disputes that miss how mathematics actually develops in favor a narrative (one that I'm guilty of repeating here).

Mathematics also gets used in ways that have ethical consequences we rarely discuss in math departments. Algorithms perpetuate bias because they're trained on biased data or designed by people who don't consider how they'll be used. Financial models led to the 2008 economic crisis because the models made assumptions that turned out catastrophically incorrect. Mathematics isn't neutral when it's applied; we teach it as if the applications are someone else's problem.

The field itself often feels elitist in ways that go beyond who gets admitted to graduate programs. There's a culture of genius worship, of problems being interesting only if they're hard enough to stump everyone, of mathematics as a game played by an intellectual elite. I don't see many mathematicians asking whether we have obligations to make our work accessible, to think about who benefits from our research, to consider whether the way we structure the field excludes people who could contribute.

Maybe these questions seem tangential to doing mathematics; maybe they're outside the scope of what a mathematician should worry about. But if I'm going to spend the next decade in this field, I need to know whether it's possible to care about these things and still be taken seriously as a mathematician. Right now, I'm not sure it is.

I understand this reads like a crackpot essay at times, but these are genuine concerns I have. 
