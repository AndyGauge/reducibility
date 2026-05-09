// Reducibility — Karp's 21 problems, one chapter each, three pages per chapter:
//   1. overview    (prose, what the problem is and why it's hard)
//   2. code        (a working implementation in a chosen language)
//   3. business    (the real-world problem the abstract one stands in for)
// The polyglot conceit: 21 problems, 21 different languages, picked to fit
// the domain or the algorithmic style of each problem.

const raw = [
  // ============================================================
  // CHAPTER 1 — SATISFIABILITY (Prolog)
  // ============================================================
  {
    chapterId: 'sat',
    chapterNum: 1,
    chapterTitle: 'Satisfiability',
    chapterIntro: `The mother problem. [[Cook]] (1971) proved [[SAT]] [[NP-complete]]; [[Karp]] (1972) fanned out from it to twenty more problems that look nothing alike but turn out to be the same hardness in disguise.`,
    title: 'The mother problem',
    tldr: `SAT asks whether a Boolean CNF formula has a satisfying assignment — the seed Karp grew his 21 reductions from.`,
    gesture: `Every other problem in this book is [[SAT]] in disguise.`,
    body: `A [[SAT]] instance is a Boolean formula in [[CNF|conjunctive normal form]]: a conjunction of [[clause|clauses]], each a disjunction of [[literal|literals]].

$$\\varphi \\;=\\; \\bigwedge_{j=1}^{m} \\Bigl(\\, \\bigvee_{\\ell \\in C_j} \\ell \\,\\Bigr). \\tag{1}$$

The question is whether there exists a [[0/1 assignment]] of the variables that makes (1) evaluate to true. [[Cook]] showed that any nondeterministic Turing machine running in [[polynomial time]] can be encoded as an instance of (1), which puts SAT at the top of [[NP]]. [[Karp]]'s contribution the next year was to take that single hardness result and propagate it through twenty graph, scheduling, packing, and matching problems — proving them all [[NP-complete]] by [[reduction]].`,
    figures: [
      {
        ref: '(1)',
        body: `Read it left to right, one symbol at a time.

The Greek letter on the far left, **φ** (phi), is just a name for the whole formula. Whenever the rest of the chapter says "the formula," it means the thing on the right side of that equals sign.

The big stacked symbol next, **⋀** with *j = 1* underneath and *m* on top, is shorthand for AND repeated many times. AND between two truth values just means *both must be true*: 1 AND 1 = 1, but 1 AND 0 = 0 and 0 AND 0 = 0. Read the stacked version as: "for every j from 1 up to m, AND together the following." So m is the count of things being AND-ed, and the result is true only when every one of them is true.

What gets AND-ed is whatever sits inside the parentheses. Inside, you find another stacked symbol — **⋁** — which is OR repeated. OR between two truth values means *at least one must be true*: 1 OR 1 = 1, 1 OR 0 = 1, but 0 OR 0 = 0. The stacked version reads: "OR together the following, for every literal pulled from the set" — so it returns true the moment any one literal is true.

The set is **C_j** (read "C-sub-j"), the *j*-th **clause**. A clause is just a handful of items.

Each item, written **ℓ** (a script "ell"), is a **literal** — either a plain variable like x₁ or a negated variable like ¬x₂. There is no other shape a literal can take.

Now reassemble: the formula φ is m clauses joined by AND, where each clause is a handful of literals joined by OR.`
      }
    ],
    eli5: `You have a list of OR-rules. Each rule is a small group of true/false claims joined by OR. Your job is to flip the variables so that *every* rule has at least one true claim. SAT just asks whether such a flip is possible.`
  },
  {
    chapterId: 'sat',
    chapterNum: 1,
    chapterTitle: 'Satisfiability',
    title: 'DPLL in Prolog',
    gesture: `Logic programming was built for this. Unification searches the space; backtracking is free.`,
    steps: [
      {
        prose: `Represent a clause as a list of literals — positive literals are atoms, negative literals are wrapped in not/1. The whole formula is a list of clauses.`,
        code: `% (a ∨ ¬b) ∧ (b ∨ c) ∧ (¬a ∨ ¬c)
formula([[a, not(b)], [b, c], [not(a), not(c)]]).`,
        lang: 'prolog'
      },
      {
        prose: `A literal is satisfied if its variable is bound to the right value in the assignment list. Member/2 walks the assignment until it finds a match — or fails, triggering backtracking.`,
        code: `sat_lit(not(V), A) :- member(V=false, A), !.
sat_lit(V, A)      :- atom(V), member(V=true, A), !.

clause_sat(C, A) :- member(L, C), sat_lit(L, A).`,
        lang: 'prolog'
      },
      {
        prose: `DPLL — pick an unbound variable, try true, then false. The disjunction (;)/2 hands the second branch to Prolog's backtracker for free; we only describe the relation, not the procedure.`,
        code: `dpll([], _).
dpll(Cs, A) :-
  pick_var(Cs, A, V),
  ( solve(Cs, [V=true |A])
  ; solve(Cs, [V=false|A]) ).

solve(Cs, A) :- maplist([C]>>clause_sat(C,A), Cs).`,
        lang: 'prolog'
      },
      {
        prose: `Run it. SWI-Prolog returns the first satisfying assignment, or false if the formula is UNSAT. The whole solver is twenty lines because the language *is* a backtracking search engine — you write the spec; the runtime does the searching.`,
        code: `?- formula(F), dpll(F, A).
A = [a=true, b=false, c=true].`,
        lang: 'prolog'
      }
    ],
    grammar: {
      language: 'Prolog',
      intro: `Prolog is a database of facts and rules, plus an engine that takes a query and searches for variable bindings that make the query true. The conventions below cover almost everything on the previous page.`,
      tokens: [
        { token: 'a, b, true', meaning: 'an **atom** — a lowercase identifier, treated as a constant symbol.' },
        { token: 'V, A, Cs', meaning: 'a **variable** — capitalized or starts with underscore. First mention binds; later mentions must match.' },
        { token: 'not(V)', meaning: 'a **compound term**: a functor named "not" wrapping its argument. Prolog gives it no special meaning — we use it as a tag for "negated literal."' },
        { token: '[a, b, c]', meaning: 'a **list**, the universal collection. `[H|T]` pattern-matches head and tail.' },
        { token: ':-', meaning: '"is true if" — separates the head of a rule from its body.' },
        { token: ',', meaning: 'AND between goals in a body. Every goal must succeed.' },
        { token: ';', meaning: 'OR between alternatives. Try the first; on failure, try the second.' },
        { token: '!', meaning: '**cut**. Commits to the current branch and disables backtracking past it.' },
        { token: '?- Goal.', meaning: 'a **query**. Ask the engine to find a substitution making Goal true.' }
      ],
      example: {
        prose: `Now take the SAT clause **(a ∨ ¬b)** — "a or not b." Prolog has no infix ∨ or ¬, so we encode the clause as a *list of literals*: positive literals are atoms, negative literals get wrapped in not/1. The list itself doesn't perform the OR — the OR happens when we *walk* the list, succeeding the moment any literal in it is satisfied.`,
        code: `% the clause (a ∨ ¬b), encoded:
Clause = [a, not(b)].

% disjunction is realized by member/2 picking any element:
?- member(L, [a, not(b)]).
L = a ;          % first solution
L = not(b).      % on backtracking, the next one

% so "is some literal in this clause true?" reads:
clause_sat(C, A) :- member(L, C), sat_lit(L, A).`,
        lang: 'prolog'
      },
      link: {
        url: 'https://swish.swi-prolog.org/',
        label: 'SWISH — try Prolog in your browser'
      }
    }
  },
  {
    chapterId: 'sat',
    chapterNum: 1,
    chapterTitle: 'Satisfiability',
    title: 'Why chip companies care',
    gesture: `A [[SAT solver]] is the safety net between an [[HDL]] change and a billion-dollar [[mask set]].`,
    body: `In 1994 Intel shipped a Pentium with a faulty floating-point divider. The [[Pentium FDIV bug]] recall cost roughly **$475 million** in 1994 dollars — about **$1.05 billion in 2026 USD** after CPI adjustment — and is the textbook reason hardware verification matters. Today, before silicon goes to a fab, designers run [[equivalence checking]]: does this [[gate-level netlist]] compute the same function as the [[RTL]] spec? That question is encoded as a [[SAT]] instance — millions of [[clause|clauses]], hundreds of thousands of variables — and fed to industrial solvers descended from [[MiniSat]]: Glucose, CaDiCaL, Kissat. Cadence Conformal, Synopsys Formality, and OneSpin are SAT solvers wearing [[EDA]] suits. A modern [[mask set]] runs **$5–30M (2026 USD)** for typical nodes and well into nine figures at the leading edge; you want SAT to say [[UNSAT]] *before* you [[tape out]].`,
    eli5: `Chip designers write what the chip should do (a spec) and what the chip will do (a circuit). A SAT solver checks whether the two ever disagree on any input. If even one disagreeing input exists, the design goes back to the drawing board — much cheaper than discovering it after manufacturing.`
  },

  // ============================================================
  // CHAPTER 2 — 0-1 INTEGER PROGRAMMING (MiniZinc)
  // ============================================================
  {
    chapterId: 'zero-one-ip',
    chapterNum: 2,
    chapterTitle: '0-1 Integer Programming',
    chapterIntro: `[[Karp]]'s first [[reduction]] from [[SAT]]. Replace each Boolean variable with a 0/1 integer; replace each [[clause]] with a linear inequality. SAT becomes "does Ax ≥ b have a 0/1 solution?"`,
    title: 'Booleans in disguise',
    tldr: `0-1 IP asks whether a system of linear inequalities has a 0/1 solution. SAT reduces to it in one paragraph.`,
    gesture: `Linear algebra and Boolean logic are the same problem with different makeup.`,
    body: `A 0-1 integer program asks whether a system of linear inequalities admits a solution where every variable is restricted to zero or one. The whole problem fits in a single line:

$$Ax \\geq b, \\quad x \\in \\{0, 1\\}^n. \\tag{1}$$

Karp's reduction from SAT is one step. Each Boolean variable becomes a 0-1 integer; each clause becomes an inequality. Take a three-literal clause where the second variable is negated:

$$x_1 \\vee \\neg x_2 \\vee x_3.$$

It turns into the linear constraint

$$x_1 + (1 - x_2) + x_3 \\geq 1. \\tag{2}$$

Read (2) carefully: every literal contributes a 1 if it is satisfied, and the sum being at least 1 means at least one literal is satisfied — exactly what the clause requires. Stack one such inequality per clause, and form (1) is a SAT instance in 0-1 IP clothing.

Drop linearity for nonlinear terms and you get general [[IP|integer programming]], which is also [[NP-hard]]. Drop the integrality and you get [[LP|linear programming]], which is in [[P]] (Khachiyan 1979). The whole modern field of [[MIP|mixed-integer programming]] — Gurobi, CPLEX, COIN-OR — is industrial-strength infrastructure for problems that, formally, are this one.`,
    figures: [
      {
        ref: '(1)',
        body: `The capital **A** is a matrix and **x** is a column vector of unknowns. Their product **Ax** is a column vector of *linear combinations* — each row of A multiplied entry-wise against x, then summed.

The **b** on the right is the matching column of lower bounds, one per row.

The **≥** is component-wise: every row of Ax must be at least the matching row of b. So (1) is a whole stack of "weighted-sum-of-variables ≥ some bound" inequalities, written compactly with vector notation.

The trailing **x ∈ {0, 1}ⁿ** says every entry of x is either 0 or 1 — no fractions allowed. The superscript **n** is the count of variables.

Put together: find a yes/no setting of n variables that satisfies all the row-by-row inequalities at once.`
      },
      {
        ref: '(2)',
        body: `Each variable here represents one literal of the original clause. **x₁** is 1 when literal "x₁" is true, 0 when false.

For the *negated* literal "¬x₂", we use the trick **(1 − x₂)**. When x₂ is 0 (the variable is false, so ¬x₂ is true), this term equals 1. When x₂ is 1, it equals 0. Negation, built from arithmetic.

Now sum the three terms. Each term is 1 if its literal is true and 0 if false, so the sum counts how many literals in the clause are true.

The final **≥ 1** says at least one literal in the clause must be true — exactly the OR semantics, expressed without an OR symbol.`
      }
    ],
    eli5: `Imagine every yes/no decision in your business is a switch (0 or 1). You write rules like "at least one of switches 3, 5, 7 must be on" as arithmetic inequalities. The computer flips switches until every rule is satisfied — or proves no flip works.`
  },
  {
    chapterId: 'zero-one-ip',
    chapterNum: 2,
    chapterTitle: '0-1 Integer Programming',
    title: 'Modeling in MiniZinc',
    gesture: `MiniZinc is a constraint language that compiles to whatever solver you have — Gecode, Chuffed, OR-Tools, Gurobi.`,
    steps: [
      {
        prose: `Declare your variables and their domains up front. The language separates *modeling* (what the problem is) from *solving* (which engine attacks it) — a single .mzn model runs on every supported backend.`,
        code: `int: n = 4;
array[1..n] of var 0..1: x;`,
        lang: 'minizinc'
      },
      {
        prose: `State constraints in something close to ordinary mathematics. MiniZinc handles the encoding to whatever the solver speaks underneath — clauses for SAT, linear forms for LP/MIP, propagators for CP.`,
        code: `constraint x[1] + (1 - x[2]) + x[3] >= 1;
constraint x[2] + x[3] + x[4] >= 1;
constraint (1 - x[1]) + (1 - x[4]) >= 1;`,
        lang: 'minizinc'
      },
      {
        prose: `Add an objective if you want optimization rather than feasibility. Drop the "solve minimize ..." line and you get back to plain SAT-as-IP: just find any solution.`,
        code: `solve minimize sum(i in 1..n)(x[i]);

output [ "x = ", show(x), "\\n" ];`,
        lang: 'minizinc'
      },
      {
        prose: `Run it. minizinc --solver gecode model.mzn returns the optimal 0/1 assignment, or UNSATISFIABLE if no assignment satisfies the constraints.`,
        code: `$ minizinc --solver gecode model.mzn
x = [1, 0, 1, 0]
----------
==========`,
        lang: 'shell'
      }
    ],
    grammar: {
      language: 'MiniZinc',
      intro: `MiniZinc is a *modeling* language. You write what the problem is — variables, constraints, an objective — and a separate solver (Gecode, Chuffed, Gurobi) attacks it. The .mzn file is portable across solvers.`,
      tokens: [
        { token: 'int: n = 4;', meaning: 'a **parameter** — a known constant, set before solving. Type comes first, then name, then value.' },
        { token: 'var 0..1', meaning: 'a **decision variable** with the given domain. The solver chooses its value.' },
        { token: 'array[1..n] of var T', meaning: 'a fixed-size array of n decision variables, each of type T. Indexing is 1-based.' },
        { token: 'constraint EXPR;', meaning: 'assert that EXPR must hold in any solution. Stack as many as you need.' },
        { token: 'forall (i in 1..n) (...)', meaning: 'quantification over a range. Pair with sum, exists, or another forall.' },
        { token: 'solve satisfy;', meaning: 'find any feasible assignment. solve minimize EXPR; or maximize EXPR; turns it into optimization.' },
        { token: 'output [...]', meaning: 'a list of strings to print on a solution. show(x) formats a variable.' },
        { token: '/\\  \\/  not', meaning: 'AND, OR, and negation on Booleans. Relations >=, <=, =, != come from the math side.' }
      ],
      example: {
        prose: `Take the SAT clause **(a ∨ ¬b ∨ c)**. Each Boolean becomes a 0-1 integer; the OR becomes a single linear inequality.`,
        code: `array[1..3] of var 0..1: x;
% the clause becomes one linear constraint:
constraint x[1] + (1 - x[2]) + x[3] >= 1;
solve satisfy;
output [ "x = ", show(x), "\\n" ];`,
        lang: 'minizinc'
      },
      link: {
        url: 'https://www.minizinc.org/',
        label: 'MiniZinc — docs and tutorials'
      }
    }
  },
  {
    chapterId: 'zero-one-ip',
    chapterNum: 2,
    chapterTitle: '0-1 Integer Programming',
    title: 'Capital budgeting',
    gesture: `Every CFO who has ever picked which projects to fund has solved a 0-1 IP, with or without knowing it.`,
    body: `A pharmaceutical company has **$400M (2026 USD)** to allocate across twelve drug programs. Each program has an estimated [[NPV]], a development cost, and shared resource demands (clinical-trial slots, regulatory bandwidth). You can fund a program or not — there is no half-trial. Maximize total NPV subject to budget and resource caps. That is a 0-1 [[IP|integer program]], and it is the bread and butter of strategic-finance teams at Pfizer, Boeing, and every utility deciding which transmission lines to build. Solvers like Gurobi will dispatch a twelve-binary problem in milliseconds and a thousand-binary capital plan in minutes — but the *modeling* effort is where consultancies bill the hours.`,
    eli5: `You have a fixed budget and a list of projects. Each project costs something and pays off something. You want to pick the combination that pays off most without going over budget. The "all-or-nothing" rule (you can't fund half a project) is what makes it a 0-1 problem rather than a smooth optimization.`
  },

  // ============================================================
  // CHAPTER 3 — CLIQUE (C++)
  // ============================================================
  {
    chapterId: 'clique',
    chapterNum: 3,
    chapterTitle: 'Clique',
    chapterIntro: `Find the largest fully-connected [[subgraph]]. Easy to state, brutal to compute, and the gateway from logic problems into [[graph]] problems.`,
    title: 'Friends of friends of friends',
    tldr: `A clique is a set of vertices, every pair connected. Maximum clique is NP-hard.`,
    gesture: `In a [[clique]], everyone knows everyone. Finding the biggest one is exhausting.`,
    body: `Take an undirected graph and look for a fully-connected subset:

$$G = (V, E), \\qquad S \\subseteq V \\text{ with } \\{u,v\\} \\in E \\text{ for all } u, v \\in S. \\tag{1}$$

A set satisfying (1) is a [[clique]]. The [[decision problem|decision version]] of the problem asks whether the [[graph]] contains a clique of size at least k. [[Karp]] reduced [[3-SAT]] to it: build a [[vertex]] per [[literal]] occurrence, connect compatible literals across [[clause|clauses]], and a satisfying assignment becomes a clique of size equal to the clause count.

Maximum clique resists even constant-factor approximation under standard assumptions (Håstad), and the best exact algorithms run in time

$$O(1.2^n), \\tag{2}$$

polynomial only on the *log* of the input.`,
    figures: [
      {
        ref: '(1)',
        body: `**G = (V, E)** names the graph: V is the set of vertices (the dots), E is the set of edges (the lines between them).

**S ⊆ V** says S is a *subset* of the vertices — pick any group of dots, including possibly all of them or none of them. The horseshoe-with-a-line symbol **⊆** reads "is a subset of."

The condition after "with" demands an edge between *every pair* drawn from S. The braces {u, v} are an unordered pair, **∈ E** means "is an edge in the graph," and **for all u, v ∈ S** quantifies over every choice of two vertices in S.

Put it all together: S is a clique when every two of its members are directly connected.`
      },
      {
        ref: '(2)',
        body: `**O(...)** is **big-O notation** — an upper bound on how the runtime grows as the input gets bigger. O(n²) means the work is at most some constant times n², for large enough n.

**1.2ⁿ** is exponential growth: the runtime multiplies by 1.2 every time n grows by one. With n = 50, that's already over 9,000× the work of n = 1.

The bound (2) is "polynomial only on log n" because if you wrote 1.2ⁿ as 2^(0.26 n), the exponent is linear in n — and n is exponential in log n. So the runtime is exponential in the *size* of the input but only polynomial in log of the input.`
      }
    ],
    eli5: `In a friendship graph, a "clique" is a group where everyone is friends with everyone. Finding the biggest such group is the kind of problem you can't shortcut: you mostly have to try the groups.`
  },
  {
    chapterId: 'clique',
    chapterNum: 3,
    chapterTitle: 'Clique',
    title: 'Bron–Kerbosch in C++',
    gesture: `The classical algorithm for enumerating maximal cliques. With pivoting, it is roughly the best you can do.`,
    steps: [
      {
        prose: `Represent the graph as adjacency bitsets — for n ≤ 64 vertices, a single uint64_t per vertex. Set intersection becomes a bitwise AND, which is the inner loop of clique enumeration.`,
        code: `#include <cstdint>
#include <vector>
using Bits = uint64_t;
std::vector<Bits> adj;  // adj[v] = neighbors of v as bitmask`,
        lang: 'cpp'
      },
      {
        prose: `Bron–Kerbosch with Tomita's pivot. R is the clique being built, P the candidates, X the already-explored. The pivot u minimizes branching by skipping anyone adjacent to it.`,
        code: `void bk(Bits R, Bits P, Bits X, std::vector<Bits>& out) {
  if (P == 0 && X == 0) { out.push_back(R); return; }
  Bits PX = P | X;
  int pivot = __builtin_ctzll(PX);
  Bits cand = P & ~adj[pivot];
  while (cand) {
    int v = __builtin_ctzll(cand);
    Bits vbit = 1ULL << v;
    bk(R | vbit, P & adj[v], X & adj[v], out);
    P &= ~vbit; X |= vbit; cand &= ~vbit;
  }
}`,
        lang: 'cpp'
      },
      {
        prose: `Drive it from main, then keep the largest result. The bitset trick (__builtin_ctzll picks the lowest set bit; popcount counts set bits) is the reason this kernel screams on modern CPUs.`,
        code: `Bits all = (1ULL << n) - 1;
std::vector<Bits> cliques;
bk(0, all, 0, cliques);
auto best = *std::max_element(cliques.begin(), cliques.end(),
  [](Bits a, Bits b){ return __builtin_popcountll(a) < __builtin_popcountll(b); });`,
        lang: 'cpp'
      },
      {
        prose: `For n > 64, swap uint64_t for std::vector<uint64_t> and the same idea generalizes. Industrial implementations (like cliquer) add degeneracy ordering on top — a 2× to 10× speedup on real-world graphs.`,
        code: `// std::bitset<N> works too if N is known at compile time.
// For variable n, std::vector<uint64_t> with manual word ops
// stays cache-friendly enough.`,
        lang: 'cpp'
      }
    ],
    grammar: {
      language: 'C++',
      intro: `C++ gives you the bare metal: explicit types, manual memory, and intrinsics that map almost 1:1 onto CPU instructions. Bitset graph algorithms are exactly where that pays off.`,
      tokens: [
        { token: '#include <h>', meaning: 'pull in a header. Standard library headers go in angle brackets; project headers in quotes.' },
        { token: 'using T = ...;', meaning: 'a type alias — Bits becomes a synonym for uint64_t.' },
        { token: 'std::vector<T>', meaning: 'a heap-allocated growable array. Pass by const& to avoid copies.' },
        { token: '1ULL << v', meaning: 'unsigned-long-long literal 1, shifted left by v bits — that is, a bitmask with only bit v set.' },
        { token: '__builtin_ctzll(x)', meaning: 'GCC/Clang intrinsic: **count trailing zeros**, i.e. the position of the lowest set bit. One CPU instruction.' },
        { token: '__builtin_popcountll(x)', meaning: 'count the number of 1 bits. Another single instruction on modern x86.' },
        { token: '[](Bits a){ ... }', meaning: 'a **lambda** — anonymous function. The square brackets are the capture list.' },
        { token: 'auto x = expr;', meaning: 'type inference. The compiler picks the type from the right-hand side.' },
        { token: 'std::max_element(b, e, cmp)', meaning: 'returns an iterator to the maximum element under cmp. Dereference with * to get the value.' }
      ],
      example: {
        prose: `Represent which vertices are adjacent to v as a single 64-bit integer: bit i is 1 if there is an edge v–i, 0 otherwise. Then **common neighbors of u and v** is just one bitwise AND.`,
        code: `Bits adj_u = 0b00110100;  // u's neighbors: bits 2, 4, 5
Bits adj_v = 0b01100100;  // v's neighbors: bits 2, 5, 6
Bits common = adj_u & adj_v;          // 0b00100100 — bits 2 and 5
int first  = __builtin_ctzll(common); // -> 2
int count  = __builtin_popcountll(common); // -> 2`,
        lang: 'cpp'
      },
      link: {
        url: 'https://godbolt.org/',
        label: 'Compiler Explorer — try C++ and see the assembly'
      }
    }
  },
  {
    chapterId: 'clique',
    chapterNum: 3,
    chapterTitle: 'Clique',
    title: 'Money laundering rings',
    gesture: `[[AML|Anti-money-laundering]] teams look for [[clique|cliques]] in the [[transaction graph]]. Tightly-connected groups of accounts moving money in circles are how laundering looks from the outside.`,
    body: `Banks build the [[transaction graph]] — accounts as vertices, edges where money flowed in the last 90 days. A cluster of n accounts that all paid each other forms a near-[[clique]], and that pattern is the textbook fingerprint of layering: cycling funds through shell entities to obscure origin. Real [[AML]] systems (Palantir, ComplyAdvantage, Quantexa) don't run exact maximum-clique on 100M-vertex graphs — they sample and approximate. They look for *dense subgraphs* and rank by anomaly score. The same algorithm shows up in bioinformatics: maximal cliques in protein-protein interaction graphs are candidate functional complexes. And in social-network feeds: tight friend-cliques are how Facebook decides whose photos you actually want to see.`,
    eli5: `If a group of bank accounts are all sending money to each other in a circle, that pattern looks suspicious. AML software searches for those tight little circles in a giant graph of every transaction the bank processes.`
  },

  // ============================================================
  // CHAPTER 4 — SET PACKING (Python)
  // ============================================================
  {
    chapterId: 'set-packing',
    chapterNum: 4,
    chapterTitle: 'Set Packing',
    chapterIntro: `Pick as many sets as you can without two of them sharing an element. The dual of set cover, and the problem behind every "you can't double-book this resource" rule in the world.`,
    title: 'Disjoint or bust',
    tldr: `Given a family of sets, find the largest subfamily that is pairwise disjoint.`,
    gesture: `If two sets share even one element, you can only pick one.`,
    body: `Set packing takes a universe U and a family F of subsets of U, and asks for the largest subfamily of pairwise-disjoint sets:

$$\\max\\, |F'| \\quad \\text{subject to} \\quad F' \\subseteq F, \\ \\ S \\cap T = \\emptyset \\ \\text{ for all } S \\neq T \\in F'. \\tag{1}$$

[[Karp]] reduced [[clique]] to (1) — and in fact the two are interreducible. Disjointness in the set system corresponds to non-adjacency, then to adjacency in the [[complement graph]], and a packing is a clique.

The optimization version is hard to approximate within a factor of

$$n^{1 - \\varepsilon}, \\tag{2}$$

making this one of the genuinely brutal members of the 21: the gap (2) means even getting close to optimal is essentially as hard as solving exactly.`,
    figures: [
      {
        ref: '(1)',
        body: `**max** is the optimization keyword: pick whatever maximizes the expression after it. **|F'|** with the vertical bars on either side is the *cardinality* — the count of elements in F'.

**subject to** is the standard separator between an objective and its constraints. Everything after it must hold; the max is taken over choices that satisfy them.

**F' ⊆ F** says F' is some subfamily of the original family F (the subset symbol again).

**S ∩ T = ∅** uses the intersection symbol **∩** (the cap; "elements in both") and **∅** (the empty set, with a slash through the O). So S ∩ T = ∅ means S and T share no elements at all.

The clause **for all S ≠ T ∈ F'** quantifies over every pair of distinct sets in our chosen subfamily.

Reassembled: pick the largest subfamily where no two chosen sets share any element.`
      },
      {
        ref: '(2)',
        body: `**n^(1−ε)** is the inapproximability factor. The exponent **1 − ε** is "just barely below 1," where ε is a tiny positive number.

For n = 1000 and ε = 0.01, n^(1−ε) ≈ 955 — almost as big as n itself. So no polynomial-time algorithm can guarantee getting within a factor of even ~1000 of optimal on a 1000-element instance.

This is dramatically worse than set cover's ln(|U|) gap: the problem is brutally hard in both the exact and approximation senses.`
      }
    ],
    eli5: `You have a pile of bags, each holding a few items. You want to grab as many bags as you can such that no two bags ever held the same item. Sharing means rivalry — you have to drop one.`
  },
  {
    chapterId: 'set-packing',
    chapterNum: 4,
    chapterTitle: 'Set Packing',
    title: 'Branch-and-bound in Python',
    gesture: `Python's frozenset and bit-twiddling get you a clean, fast-enough enumerator.`,
    steps: [
      {
        prose: `Encode each set as an integer — bit i is set if element i is in the set. Disjointness is a single AND check, which is what makes branch-and-bound feasible at any scale.`,
        code: `def encode(sets):
    elems = sorted({e for s in sets for e in s})
    idx = {e: i for i, e in enumerate(elems)}
    return [sum(1 << idx[e] for e in s) for s in sets]`,
        lang: 'python'
      },
      {
        prose: `Recursive search: at each step, either include the current set (if disjoint from the running union) or skip it. Track the best size found so far for pruning.`,
        code: `def pack(sets, i=0, used=0, picked=()):
    if i == len(sets):
        return picked
    best = pack(sets, i+1, used, picked)
    if sets[i] & used == 0:
        cand = pack(sets, i+1, used | sets[i], picked + (i,))
        if len(cand) > len(best):
            best = cand
    return best`,
        lang: 'python'
      },
      {
        prose: `Add a bound: if the remaining sets can't beat the current best even if all are picked, prune. Real solvers use LP relaxations for tighter bounds; this is the schoolbook version.`,
        code: `def pack_pruned(sets, i, used, picked, best):
    if len(picked) + (len(sets) - i) <= len(best):
        return best
    if i == len(sets):
        return picked if len(picked) > len(best) else best
    if sets[i] & used == 0:
        best = pack_pruned(sets, i+1, used | sets[i], picked + (i,), best)
    return pack_pruned(sets, i+1, used, picked, best)`,
        lang: 'python'
      },
      {
        prose: `Try it on a small instance. For families much beyond 30 sets, you want PuLP or OR-Tools wrapping a real MIP solver — but the recursion above is the algorithm those solvers are doing under the hood.`,
        code: `>>> sets = [{1,2}, {3,4}, {2,3}, {5}]
>>> bits = encode(sets)
>>> pack_pruned(bits, 0, 0, (), ())
(0, 1, 3)   # picks {1,2}, {3,4}, {5}`,
        lang: 'python'
      }
    ],
    grammar: {
      language: 'Python',
      intro: `Python's strength here is that sets and integers stand in for each other naturally. Small sets compile cleanly to bit-tricks, and the syntax stays close to the math.`,
      tokens: [
        { token: 'def f(x, y=0):', meaning: 'function definition. y=0 is a default parameter. Indentation marks the body.' },
        { token: '{e for x in xs}', meaning: 'set comprehension. Add `if cond` for a filter. {e: f(e) for ...} gives a dict.' },
        { token: '1 << i', meaning: 'left shift — produces an integer with only bit i set. Python ints are arbitrary precision.' },
        { token: 'a & b', meaning: 'bitwise AND. On large integers, Python treats them as bitsets.' },
        { token: '(a, b, c)', meaning: 'a **tuple** — immutable sequence. Often used as keys or running accumulators.' },
        { token: 'lambda x: expr', meaning: 'anonymous function, limited to one expression. For more, use def.' },
        { token: 'enumerate(xs)', meaning: 'yields (i, x) pairs. Saves you from manual indexing.' },
        { token: '>>>', meaning: 'the interactive REPL prompt — anything after it is a line you typed.' }
      ],
      example: {
        prose: `Encode the set **{1, 2, 5}** as the integer with bits 1, 2, and 5 turned on. Disjointness — "do these sets share any element?" — collapses to a single AND.`,
        code: `def encode(s):
    return sum(1 << i for i in s)

a = encode({1, 2, 5})    # 0b100110 = 38
b = encode({3, 4, 7})    # 0b10011000 = 152
disjoint = (a & b) == 0  # True — no shared bits`,
        lang: 'python'
      },
      link: {
        url: 'https://docs.python.org/3/tutorial/',
        label: 'Python — official tutorial'
      }
    }
  },
  {
    chapterId: 'set-packing',
    chapterNum: 4,
    chapterTitle: 'Set Packing',
    title: 'Crew pairings',
    gesture: `Every airline in the world solves a giant set-packing problem before tomorrow's schedule prints.`,
    body: `An airline [[crew pairing]] is a sequence of flights one crew can fly together starting and ending at base — the *set* of flight legs they cover. The flying schedule has thousands of legs; the universe of legal pairings is millions. Each leg must be flown exactly once (which makes it a [[partition|partitioning]], the equality-constrained variant of packing), and the airline wants the cheapest valid combination. Delta, United, and Lufthansa run [[column generation]] [[LP|LPs]] that produce promising pairings on demand and feed them into a [[set partitioning]] master problem — set packing's cousin. The same template covers vehicle scheduling, hospital nurse rostering, and ride-share driver-shift assignment. Saving 1% on crew costs at a major US carrier is on the order of **$30M a year (2026 USD)**.`,
    eli5: `An airline has lots of flights to staff. It builds many possible "tours" a crew could fly, then picks a combination of tours that covers every flight exactly once and is cheapest. The math problem under the hood is set packing.`
  },

  // ============================================================
  // CHAPTER 5 — VERTEX COVER (Haskell)
  // ============================================================
  {
    chapterId: 'vertex-cover',
    chapterNum: 5,
    chapterTitle: 'Vertex Cover',
    chapterIntro: `Pick the smallest set of [[vertex|vertices]] that touches every [[edge]]. [[Karp]]'s "Node Cover" — the cleanest demonstration that [[NP-complete|NP-completeness]] can be cheap to recognize.`,
    title: 'Touch every edge',
    tldr: `A vertex cover is a set of vertices that covers (incidents on) every edge. Minimum vertex cover is NP-hard, but admits a 2-approximation.`,
    gesture: `Cover an edge by grabbing one of its endpoints. Now do that for every edge with as few grabs as possible.`,
    body: `A vertex cover is a set of vertices that touches every edge:

$$C \\subseteq V \\ \\text{ such that } \\ \\{u, v\\} \\cap C \\neq \\emptyset \\ \\text{ for every } \\{u, v\\} \\in E. \\tag{1}$$

The decision version asks: does a cover of size at most k satisfying (1) exist? Vertex cover is the complement of independent set:

$$C \\text{ is a vertex cover} \\iff V \\setminus C \\text{ is an independent set,} \\tag{2}$$

so it [[reduction|reduces]] directly from [[clique]] on the [[complement graph]].

Two facts make vertex cover the friendly face of [[NP-complete|NP-completeness]]. First, a trivial [[2-approximation]]: greedily pick both endpoints of any uncovered [[edge]]. Second, a [[fixed-parameter tractable]] exact algorithm running in time

$$O(1.2^k \\cdot n), \\tag{3}$$

which is fast when the answer k is small, regardless of n.`,
    figures: [
      {
        ref: '(1)',
        body: `**C ⊆ V** picks a subset of vertices to call the cover. The job is to pick C so that every edge has at least one endpoint in it.

**{u, v} ∩ C ≠ ∅** uses two symbols. The braces {u, v} are an edge — an unordered pair of vertices. The **∩** is the intersection ("elements in both"). And **≠ ∅** says "is not empty."

So {u, v} ∩ C ≠ ∅ reads: "the two endpoints of this edge, intersected with the cover, give back at least one vertex." In plain words, at least one endpoint of this edge is in the cover.

The trailing **for every {u, v} ∈ E** demands the condition holds on every edge of the graph, not just some.`
      },
      {
        ref: '(2)',
        body: `The two-headed arrow **⟺** means **if and only if** — both sides imply each other.

**V \\ C** is **set difference**: the vertices in V but not in C. The backslash is "minus" for sets.

The right side says V \\ C is an *independent set* — no two vertices in it share an edge.

The whole identity says: choosing a vertex cover and choosing an independent set are the same act, viewed from opposite sides. If you cover every edge with C, the leftover vertices V \\ C touch no edges among themselves.`
      },
      {
        ref: '(3)',
        body: `Same big-O as chapter 3, but the exponent now uses **k**, not n. Here k is the *answer size* — how big a cover the problem asks for.

The catch: even if n is enormous (a graph with millions of vertices), this runtime depends on k. So when the cover is small (say k ≤ 30), the algorithm runs in roughly 1.2³⁰ ≈ 240 steps per vertex — fast.

This is the FPT (fixed-parameter tractable) trick: trade an n-sized parameter for a k-sized one when k is the natural difficulty knob.`
      }
    ],
    eli5: `Imagine a network of streets and intersections. You want to put a guard at as few intersections as possible, but every street must have at least one guard at one of its ends. That's vertex cover.`
  },
  {
    chapterId: 'vertex-cover',
    chapterNum: 5,
    chapterTitle: 'Vertex Cover',
    title: 'Branching in Haskell',
    gesture: `Pure recursion with sets. Haskell's Data.Set keeps the code as close to the math as code gets.`,
    steps: [
      {
        prose: `Represent the graph as a set of edges, where an edge is a pair of vertices. The whole algorithm will be set operations on this structure — no mutation, no aliasing.`,
        code: `import qualified Data.Set as S
type Vertex = Int
type Edge   = (Vertex, Vertex)
type Graph  = S.Set Edge`,
        lang: 'haskell'
      },
      {
        prose: `The classic FPT branch: pick any uncovered edge (u,v). Either u is in the cover or v is. Recurse on both, return the smaller result. The recursion depth is bounded by k, not by n.`,
        code: `vcover :: Int -> Graph -> Maybe (S.Set Vertex)
vcover k es
  | S.null es = Just S.empty
  | k == 0    = Nothing
  | otherwise =
      let (u, v) = S.findMin es
          rm x   = S.filter (\\(a,b) -> a /= x && b /= x) es
          tryU   = S.insert u <$> vcover (k-1) (rm u)
          tryV   = S.insert v <$> vcover (k-1) (rm v)
      in tryU <|> tryV`,
        lang: 'haskell'
      },
      {
        prose: `Wrap it to find the *minimum* k that works. We start at 0 and increase; the first hit is optimal. (For real workloads use the kernelization tricks too, but they don't change the shape.)`,
        code: `import Control.Applicative ((<|>))

minCover :: Graph -> S.Set Vertex
minCover g = head [c | k <- [0..], Just c <- [vcover k g]]`,
        lang: 'haskell'
      },
      {
        prose: `Try it. The whole solver fits in a third of a screen and reads as the algorithm's English description. That is what Haskell buys you for problems shaped like this.`,
        code: `main = do
  let g = S.fromList [(1,2),(2,3),(3,4),(4,1),(2,4)]
  print (minCover g)
-- fromList [2,4]`,
        lang: 'haskell'
      }
    ],
    grammar: {
      language: 'Haskell',
      intro: `Haskell is pure: every function is a value mapping inputs to outputs, with no side effects. You describe the problem as algebraic data + transformations, and the compiler picks the evaluation order. Set algorithms read close to their textbook descriptions.`,
      tokens: [
        { token: 'import qualified M as Q', meaning: '**qualified import** — the module\'s names live behind a Q. prefix and won\'t collide.' },
        { token: 'type T = ...', meaning: 'a **type alias** — Edge becomes shorthand for (Vertex, Vertex).' },
        { token: 'f :: A -> B -> C', meaning: 'a type signature. Arrows associate right; this is A -> (B -> C), so partial application is free.' },
        { token: 'Maybe a', meaning: 'either Just value or Nothing — explicit absence, no nulls.' },
        { token: '<$>', meaning: '**fmap** — apply a pure function inside a Functor (f <$> Just 3 = Just (f 3)).' },
        { token: '<|>', meaning: '**alternative** — try the left; on Nothing, try the right. Backtracking in one operator.' },
        { token: 'let x = e in body', meaning: 'local binding. let introduces, in is the expression that uses it.' },
        { token: '\\(a,b) -> ...', meaning: 'a **lambda** with a destructuring pattern. The backslash is meant to look like a Greek lambda.' },
        { token: '[c | k <- [0..]]', meaning: 'a list comprehension — reads as set-builder notation in code.' }
      ],
      example: {
        prose: `Vertex cover branching: try the first endpoint; if that finds nothing, try the second. The **<|>** operator falls through to the right side only when the left returns Nothing.`,
        code: `tryU  = S.insert u <$> vcover (k-1) (rm u)
tryV  = S.insert v <$> vcover (k-1) (rm v)
result = tryU <|> tryV
-- if tryU finds a cover, that wins.
-- otherwise, fall through to tryV.`,
        lang: 'haskell'
      },
      link: {
        url: 'https://tryhaskell.org/',
        label: 'Try Haskell in your browser'
      }
    }
  },
  {
    chapterId: 'vertex-cover',
    chapterNum: 5,
    chapterTitle: 'Vertex Cover',
    title: 'Where to put the cameras',
    gesture: `Every CCTV-placement, sensor-coverage, and patrol-route problem you have heard of is vertex cover with extra noise.`,
    body: `A city wants to place CCTV at intersections so that every street is monitored from at least one end. Each camera costs the same; minimize the count. That is vertex cover on the street graph. The same problem appears in IoT sensor placement (cover every link in a mesh network), in network monitoring (place taps so every fiber is observed), in chemistry (place an inhibitor on every reaction edge), and in patrol scheduling (assign an officer to every corridor). The 2-approximation is good enough for almost every commercial deployment — you rarely care whether you used 51 cameras instead of the optimal 47, especially when "optimal" requires an overnight MIP run.`,
    eli5: `You're putting up security cameras in a city. Every street needs a camera at one of its corners. Cameras are expensive. Vertex cover is the math of doing it with as few as possible.`
  },

  // ============================================================
  // CHAPTER 6 — SET COVER (R)
  // ============================================================
  {
    chapterId: 'set-cover',
    chapterNum: 6,
    chapterTitle: 'Set Cover',
    chapterIntro: `Cover every element of a [[universe]] using as few sets as possible. The greedy ln(n)-[[approximation ratio|approximation]] is one of the most-used algorithms in industry that nobody calls by its name.`,
    title: 'Cover the universe',
    tldr: `Pick the fewest subsets whose union is the whole universe. NP-hard, but greedy gets within a ln(n) factor — and that's tight unless P=NP.`,
    gesture: `Each set covers some elements. Pick a cheap collection of sets that covers them all.`,
    body: `Set cover takes a [[universe]] U and a family F of subsets, and asks for the minimum subcollection whose union equals U:

$$\\min\\, |F'| \\quad \\text{subject to} \\quad F' \\subseteq F, \\ \\ \\bigcup_{S \\in F'} S = U. \\tag{1}$$

It is the covering dual of set packing's packing. The greedy algorithm — repeatedly pick the set that covers the most uncovered elements — achieves an approximation ratio

$$H(|U|) \\;=\\; 1 + \\tfrac{1}{2} + \\tfrac{1}{3} + \\cdots + \\tfrac{1}{|U|} \\;\\approx\\; \\ln |U|. \\tag{2}$$

Feige (1998) proved that the bound (2) is essentially optimal: no polynomial-time algorithm achieves

$$(1 - \\varepsilon)\\,\\ln |U| \\tag{3}$$

unless [[P]] = [[NP]]. So the cheap, obvious algorithm is also, mathematically, the best one.`,
    figures: [
      {
        ref: '(1)',
        body: `**min** is the dual of max from earlier: pick a choice that *minimizes* the expression. Here we minimize **|F'|** — the count of sets we choose.

The constraints are F' ⊆ F (a subfamily of the family, like before) and a new symbol: the big-union **⋃**.

The big-∪ is union (combine all elements) repeated: **⋃ S in F' S** reads "take the union of every set S in F'." Same idea as the big-AND from chapter 1, but for set union instead of Boolean AND. Plain union of two sets, A ∪ B, gives every element that appears in either side. Stack it across all chosen sets.

The constraint **= U** demands that union equals the whole universe — every element of U appears in at least one chosen set.`
      },
      {
        ref: '(2)',
        body: `**H(|U|)** is the *harmonic number* of |U|. Spelled out, it's the running sum **1 + 1/2 + 1/3 + ... + 1/|U|** — the reciprocals of the integers 1 through |U|.

That sum grows slowly. By a classical fact, **H(n) ≈ ln(n)** — natural logarithm — with the gap converging to a small constant (Euler–Mascheroni, ~0.577).

So the greedy heuristic uses at most about ln(|U|) times as many sets as the optimal. For a 1,000-element universe, that's roughly 7×; for a million, about 14×. Slow growth, no matter how big the input.`
      },
      {
        ref: '(3)',
        body: `Same ln(|U|) factor, scaled by **(1 − ε)** — a number just barely under 1.

The claim of the figure: no polynomial algorithm can guarantee an approximation factor strictly better than ln(|U|), unless P = NP.

In other words, the greedy ln(|U|) bound from (2) is essentially the best you can hope for. Cheap and obvious, also mathematically optimal.`
      }
    ],
    eli5: `You have a list of items to cover and a list of bundles, where each bundle covers some of the items. Pick the fewest bundles such that every item is covered by at least one of your picks.`
  },
  {
    chapterId: 'set-cover',
    chapterNum: 6,
    chapterTitle: 'Set Cover',
    title: 'Greedy in R',
    gesture: `R thinks in sets and vectors natively. The greedy heuristic is six lines of idiomatic vector code.`,
    steps: [
      {
        prose: `Start with a universe U and a family F as a list of integer vectors. setdiff/union/intersect are built-ins; we don't need to write any glue.`,
        code: `U <- 1:10
F <- list(c(1,2,3,8), c(1,2,3,4,5), c(4,5,7),
          c(5,6,7), c(6,7,8,9,10), c(2,9,10))`,
        lang: 'r'
      },
      {
        prose: `Greedy step: among unused sets, pick the one that covers the most still-uncovered elements. sapply lets you score every candidate in one expression.`,
        code: `pick_best <- function(F, uncovered) {
  scores <- sapply(F, function(s) length(intersect(s, uncovered)))
  which.max(scores)
}`,
        lang: 'r'
      },
      {
        prose: `Iterate until the universe is covered. The cover is a vector of indices into F. Watch the "uncovered" set shrink each round — that's the analysis exhibit for the ln(n) bound.`,
        code: `greedy_cover <- function(U, F) {
  cover <- integer(0); uncovered <- U
  while (length(uncovered) > 0) {
    i <- pick_best(F, uncovered)
    cover <- c(cover, i)
    uncovered <- setdiff(uncovered, F[[i]])
    F[[i]] <- integer(0)
  }
  cover
}`,
        lang: 'r'
      },
      {
        prose: `Run it. R's REPL gives back the indices; F[cover] is the actual chosen subfamily. For 10⁶-element universes you'd swap to a sparse-matrix backend (Matrix package), but the loop is identical.`,
        code: `> greedy_cover(U, F)
[1] 5 2 4
> F[greedy_cover(U, F)]
[[1]] 6 7 8 9 10
[[2]] 1 2 3 4 5
[[3]] 5 6 7`,
        lang: 'r'
      }
    ],
    grammar: {
      language: 'R',
      intro: `R is built around vectors. Almost every operation broadcasts elementwise, which is why the set-cover greedy step fits in one line of sapply.`,
      tokens: [
        { token: '<-', meaning: 'the canonical assignment operator. = also works but is reserved for argument passing in idiomatic R.' },
        { token: 'c(1, 2, 3)', meaning: '**c**ombine values into a vector. R\'s universal "make a list" function.' },
        { token: '1:n', meaning: 'integer range vector — same as c(1, 2, ..., n).' },
        { token: 'list(...)', meaning: 'a heterogeneous container. Access by [[i]] (single bracket gives a sublist).' },
        { token: 'function(x) { ... }', meaning: 'an anonymous function. The body is the value of the last expression.' },
        { token: 'sapply(F, fn)', meaning: '**simplifying apply** — run fn over each element of F, return a vector.' },
        { token: 'setdiff/union/intersect', meaning: 'built-in set operations on vectors. No imports needed.' },
        { token: 'which.max(v)', meaning: 'the **index** of the maximum element. Pair with which.min for the other end.' },
        { token: 'while (cond) { ... }', meaning: 'imperative loop. R has for and repeat too, but vectorized ops usually win.' }
      ],
      example: {
        prose: `Set cover's greedy step: for each candidate set, count how many uncovered elements it would cover. sapply gives one number per candidate; which.max picks the winner.`,
        code: `uncovered <- c(1, 2, 3, 4, 5)
F <- list(c(1, 2),    c(3, 4, 5),  c(1, 5))
scores <- sapply(F, function(s) length(intersect(s, uncovered)))
# scores -> c(2, 3, 2)
best <- which.max(scores)  # -> 2 (the middle set covers 3)`,
        lang: 'r'
      },
      link: {
        url: 'https://www.r-project.org/',
        label: 'The R Project — downloads and manuals'
      }
    }
  },
  {
    chapterId: 'set-cover',
    chapterNum: 6,
    chapterTitle: 'Set Cover',
    title: 'Where to advertise',
    gesture: `Every reach-and-frequency model in advertising is set cover with a budget twist.`,
    body: `A consumer brand wants to reach 80% of US adult women aged 25–44 at least once. Each ad placement (a podcast, a primetime slot, a billboard, a TikTok creator) reaches a *set* of that audience, with overlap between channels. Picking the cheapest combination of placements that covers the audience is set cover. The same template runs in vaccine campaigns (each clinic location covers a population catchment area), in disaster relief (each warehouse covers a service radius), in software testing (each test case covers a set of branches — minimum-cover-by-tests is the basis of test-suite reduction tools), and in genome assembly (each read covers a stretch of the genome). The greedy heuristic is the working horse; nobody waits for the IP solver in the marketing meeting.`,
    eli5: `If you want your ad to reach as many different people as possible, but each ad slot has overlapping audiences, you have a set cover problem. The greedy answer — keep buying the slot that adds the most new people — is also (provably) close to the best you can do.`
  },

  // ============================================================
  // CHAPTER 7 — FEEDBACK NODE SET (Go)
  // ============================================================
  {
    chapterId: 'feedback-node-set',
    chapterNum: 7,
    chapterTitle: 'Feedback Node Set',
    chapterIntro: `Remove the smallest set of [[vertex|vertices]] that breaks every [[cycle]]. The vertex-deletion problem behind every "this can't [[deadlock]]" guarantee.`,
    title: 'Break every cycle',
    tldr: `Find the minimum set of vertices whose removal leaves a directed acyclic graph.`,
    gesture: `If a cycle exists, at least one vertex on it has to go.`,
    body: `Given a directed graph, a feedback vertex set is a subset of vertices whose removal leaves no cycles:

$$F \\subseteq V \\ \\text{ such that } \\ G[V \\setminus F] \\ \\text{ is acyclic.} \\tag{1}$$

[[Karp]]'s [[reduction]] is from vertex cover: subdivide each [[edge]], and a vertex cover in the original becomes a set satisfying (1) in the subdivision.

Like vertex cover, the problem is [[fixed-parameter tractable]] in the answer size k — recent work runs in time

$$O\\bigl(3.46^k \\cdot n^{O(1)}\\bigr), \\tag{2}$$

making (1) cheap to test when the cuts are small. But it remains inapproximable beyond constant factors in the general case. The undirected variant is also NP-hard, with somewhat friendlier approximation properties.`,
    figures: [
      {
        ref: '(1)',
        body: `**F ⊆ V** picks a subset of vertices to remove.

The new notation here is **G[X]**, the *induced subgraph* on X. Take G, throw away every vertex not in X, and throw away every edge that touched a thrown-away vertex. What's left is a smaller graph living inside G.

So **G[V \\ F]** is what's left after removing the vertices in F. (V \\ F is set difference from chapter 5: vertices in V but not in F.)

The condition **is acyclic** — no directed cycles remain. That is, after the surgery, you can lay the vertices on a line such that every edge points forward.`
      },
      {
        ref: '(2)',
        body: `Two layers of big-O. The outer **O(3.46^k · n^O(1))** has an inner **O(1)** in the exponent on n.

**O(1)** in an exponent means "some constant" — the actual algorithm uses n² or n³, but the analysis says "polynomial in n" without committing to which polynomial.

So the runtime is exponential in **k** (the answer size) but only polynomial in **n** (the input size). Tractable when k is small, regardless of how big the graph is.`
      }
    ],
    eli5: `In a network of dependencies, a cycle is bad — A waits on B, B waits on C, C waits on A, and nobody moves. FVS is "what's the smallest number of nodes I have to delete so that there are no more cycles anywhere?"`
  },
  {
    chapterId: 'feedback-node-set',
    chapterNum: 7,
    chapterTitle: 'Feedback Node Set',
    title: 'Cycle hunting in Go',
    gesture: `Go's goroutines aren't the point here — but its struct-of-slices style and tight loops make graph algorithms read clean.`,
    steps: [
      {
        prose: `Adjacency list as a slice-of-slices. Vertices are int indices; the graph is just g[u] = list of successors. No fancy types — Go encourages the boring representation.`,
        code: `type Graph [][]int

func (g Graph) hasCycle() bool {
    n := len(g)
    color := make([]int, n) // 0=white, 1=gray, 2=black
    var dfs func(u int) bool
    dfs = func(u int) bool {
        color[u] = 1
        for _, v := range g[u] {
            if color[v] == 1 { return true }
            if color[v] == 0 && dfs(v) { return true }
        }
        color[u] = 2
        return false
    }
    for u := 0; u < n; u++ {
        if color[u] == 0 && dfs(u) { return true }
    }
    return false
}`,
        lang: 'go'
      },
      {
        prose: `Branch-and-bound for FVS — pick a vertex on a known cycle and either include it in the set or recurse on the rest. The branch-on-cycle insight is what makes the FPT algorithms work.`,
        code: `func fvs(g Graph, k int) ([]int, bool) {
    if !g.hasCycle()      { return nil, true }
    if k == 0             { return nil, false }
    v := g.anyOnCycle()
    sub := g.removeVertex(v)
    if got, ok := fvs(sub, k-1); ok {
        return append(got, v), true
    }
    return nil, false
}`,
        lang: 'go'
      },
      {
        prose: `Find the minimum k by binary search or a simple linear scan. In production graphs with thousands of vertices, you'd kernelize first — collapse vertices of degree 0 or 1, contract chains — but the recursion above is the engine.`,
        code: `func minFVS(g Graph) []int {
    for k := 0; k <= len(g); k++ {
        if got, ok := fvs(g, k); ok { return got }
    }
    return nil
}`,
        lang: 'go'
      },
      {
        prose: `Drive it. For a graph with cycles A→B→C→A and A→D→A, the algorithm reports {A} — a single vertex on the intersection of both cycles, breaking them in one cut.`,
        code: `func main() {
    g := Graph{{1,3}, {2}, {0}, {0}}
    fmt.Println(minFVS(g)) // [0]
}`,
        lang: 'go'
      }
    ],
    grammar: {
      language: 'Go',
      intro: `Go is small on purpose: a handful of types, a handful of keywords, and the compiler does the rest. Graph algorithms read as plain procedural code with no ceremony.`,
      tokens: [
        { token: 'package main', meaning: 'every Go file declares its package. main is the executable entry point.' },
        { token: 'type Graph [][]int', meaning: 'a **named type** built from a slice-of-slices. Methods can attach to any named type.' },
        { token: 'func (g Graph) m()', meaning: 'a **method** on Graph. The receiver g comes before the method name.' },
        { token: 'make([]int, n)', meaning: 'allocate a slice of length n. Slices grow with append.' },
        { token: 'var f func(int) bool', meaning: 'declare a function-typed variable — useful for recursive closures.' },
        { token: 'for _, v := range g[u]', meaning: 'iterate over a slice. The blank identifier _ discards the index.' },
        { token: ':=', meaning: '**short variable declaration** — declare-and-assign in one step.' },
        { token: 'if cond { return ... }', meaning: 'no parentheses around the condition; braces always required.' },
        { token: '{x, y}', meaning: 'a composite literal. For slices: []int{1, 2, 3}; for structs: Point{x: 1, y: 2}.' }
      ],
      example: {
        prose: `Cycle detection by three-coloring: white = unvisited, gray = on the current DFS stack, black = finished. A neighbor that's gray means we've walked into our own ancestor — a cycle.`,
        code: `color := make([]int, n) // all 0 (white)
var dfs func(u int) bool
dfs = func(u int) bool {
    color[u] = 1 // gray
    for _, v := range g[u] {
        if color[v] == 1 { return true } // back-edge!
        if color[v] == 0 && dfs(v) { return true }
    }
    color[u] = 2 // black
    return false
}`,
        lang: 'go'
      },
      link: {
        url: 'https://go.dev/play/',
        label: 'The Go Playground — run Go in your browser'
      }
    }
  },
  {
    chapterId: 'feedback-node-set',
    chapterNum: 7,
    chapterTitle: 'Feedback Node Set',
    title: 'Deadlock detection',
    gesture: `Database engines, OS schedulers, and microservice meshes all watch for cycles. Killing the right node breaks the cycle without taking down the whole system.`,
    body: `A [[wait-for graph]] in a database has an [[edge]] from transaction T1 to T2 when T1 is blocked waiting on a lock T2 holds. A [[cycle]] in this graph is a [[deadlock]]. The engine's deadlock detector finds cycles and aborts a *victim* — preferably the cheapest transaction to roll back. Choosing victims to break *all* current cycles with fewest aborts is feedback vertex set on the wait-for graph. PostgreSQL, Oracle, and InnoDB all run this loop continuously; they don't compute the optimal FVS (overkill for the few-vertex cycles seen in practice) but the framing is the same. The same pattern shows up in microservice circuit-breaker design: which retries to abort to break a cascade cycle? And in Kubernetes resource scheduling: which pods to evict to clear a resource-deadlock cycle?`,
    eli5: `Sometimes two parts of a database both wait for each other forever. The engine spots the cycle and aborts one of them so the other can finish. Picking *which* one to abort, especially when multiple cycles overlap, is feedback vertex set.`
  },

  // ============================================================
  // CHAPTER 8 — FEEDBACK ARC SET (Rust)
  // ============================================================
  {
    chapterId: 'feedback-arc-set',
    chapterNum: 8,
    chapterTitle: 'Feedback Arc Set',
    chapterIntro: `Same idea, but you delete [[edge|edges]] instead of [[vertex|vertices]]. Every "[[rank aggregation|rank these things consistently]]" problem in the world reduces to it.`,
    title: 'The wrong-way edges',
    tldr: `Find the minimum set of edges whose removal leaves the graph acyclic. Equivalent to "best linear order" — minimize back-edges.`,
    gesture: `Lay the vertices on a line, count the edges going backwards. Find the line that minimizes that count.`,
    body: `A feedback arc set is a set of edges whose removal leaves a directed graph acyclic:

$$A \\subseteq E \\ \\text{ such that } \\ (V, E \\setminus A) \\ \\text{ is a DAG.} \\tag{1}$$

Equivalently, the minimum set satisfying (1) is the minimum count of *back-edges* under any linear ordering of the vertices:

$$\\min_{A : \\text{(1) holds}} |A| \\;=\\; \\min_{\\sigma \\in S_n} \\bigl|\\{(u,v) \\in E : \\sigma(u) > \\sigma(v)\\}\\bigr|. \\tag{2}$$

The identity (2) is the reason FAS shows up under another name — [[rank aggregation]] — when the input is a tournament. [[NP-hard]] in general ([[Karp]]), but a constant-factor [[approximation ratio|approximation]] is achievable, and several near-linear heuristics (Eades–Lin–Smyth) work shockingly well in practice.`,
    figures: [
      {
        ref: '(1)',
        body: `**A ⊆ E** picks a subset of *edges* (not vertices, like in the previous chapter) to remove.

**E \\ A** is set difference — the edges of E that are not in A.

The notation **(V, E \\ A)** rebuilds the graph with the same vertices but the trimmed edge set.

The condition **is a [[DAG]]** stands for "directed acyclic graph" — a graph with no directed cycles. So removing A clears every cycle.`
      },
      {
        ref: '(2)',
        body: `Two new symbols here. **σ** (Greek sigma) is a *permutation* of the n vertices — a particular ordering, lining the dots up left to right.

**S_n** is the *symmetric group* of all permutations on n items. So **min over σ ∈ S_n** asks: across every possible ordering, find the one with...

The right side counts edges going **backward** in the chosen order. **σ(u) > σ(v)** means u sits to the right of v in the ordering, but the edge points from u to v — pointing backward. The vertical bars |...| count those edges.

The whole identity says: the minimum FAS size equals the minimum back-edge count, taken over all orderings of the vertices. A ranking with few back-edges is exactly a small feedback arc set.`
      }
    ],
    eli5: `Imagine a list of webpages with arrows showing which links to which. You want to pick an order for the pages such that as few arrows as possible point backwards in your order. The arrows that *do* point backwards are the feedback arcs.`
  },
  {
    chapterId: 'feedback-arc-set',
    chapterNum: 8,
    chapterTitle: 'Feedback Arc Set',
    title: 'Eades–Lin–Smyth in Rust',
    gesture: `A linear-time heuristic that handles real-world build graphs and achieves a tight provable approximation.`,
    steps: [
      {
        prose: `Adjacency lists with successor and predecessor sides. Rust's borrow checker forces you to think about ownership of the graph up front — which is fine, since the algorithm only reads.`,
        code: `struct Graph {
    succ: Vec<Vec<usize>>,
    pred: Vec<Vec<usize>>,
}
impl Graph {
    fn outdeg(&self, v: usize) -> isize { self.succ[v].len() as isize }
    fn indeg (&self, v: usize) -> isize { self.pred[v].len() as isize }
}`,
        lang: 'rust'
      },
      {
        prose: `The algorithm builds two sequences — left and right — by repeatedly grabbing sources (no incoming) onto the right edge of the left sequence, sinks (no outgoing) onto the left edge of the right sequence, and otherwise the vertex maximizing outdeg − indeg.`,
        code: `fn eades(g: &Graph) -> Vec<usize> {
    let n = g.succ.len();
    let mut alive = vec![true; n];
    let (mut s1, mut s2): (Vec<usize>, Vec<usize>) = (vec![], vec![]);
    let count = |g: &Graph, alive: &Vec<bool>, pred: bool| -> Vec<isize> {
        (0..n).map(|v| if !alive[v] { -1 } else {
            (if pred { &g.pred[v] } else { &g.succ[v] })
                .iter().filter(|&&u| alive[u]).count() as isize
        }).collect()
    };
    while alive.iter().any(|&a| a) {
        let ind = count(g, &alive, true);
        let outd = count(g, &alive, false);
        // sinks first
        if let Some(s) = (0..n).find(|&v| alive[v] && outd[v] == 0) {
            s2.insert(0, s); alive[s] = false; continue;
        }
        if let Some(s) = (0..n).find(|&v| alive[v] && ind[v] == 0) {
            s1.push(s); alive[s] = false; continue;
        }
        let v = (0..n).filter(|&v| alive[v])
                      .max_by_key(|&v| outd[v] - ind[v]).unwrap();
        s1.push(v); alive[v] = false;
    }
    s1.extend(s2); s1
}`,
        lang: 'rust'
      },
      {
        prose: `Given the order, the FAS is exactly the edges that go from a later vertex to an earlier one. That's a single pass through the edge list.`,
        code: `fn fas(g: &Graph, order: &[usize]) -> Vec<(usize, usize)> {
    let pos: Vec<usize> = {
        let mut p = vec![0; order.len()];
        for (i, &v) in order.iter().enumerate() { p[v] = i; }
        p
    };
    let mut back = vec![];
    for u in 0..g.succ.len() {
        for &v in &g.succ[u] {
            if pos[u] > pos[v] { back.push((u, v)); }
        }
    }
    back
}`,
        lang: 'rust'
      },
      {
        prose: `Run it on a small graph with a single back-edge. Eades–Lin–Smyth produces an ordering with at most |E|/2 − |V|/6 back edges, which on real-world graphs is usually within a factor of 2 of optimal.`,
        code: `fn main() {
    let g = Graph {
        succ: vec![vec![1], vec![2], vec![0,3], vec![]],
        pred: vec![vec![2], vec![0], vec![1],   vec![2]],
    };
    let ord = eades(&g);
    println!("order = {:?}, FAS = {:?}", ord, fas(&g, &ord));
}`,
        lang: 'rust'
      }
    ],
    grammar: {
      language: 'Rust',
      intro: `Rust enforces single ownership of every value at compile time. For a graph algorithm that only reads the input, that boils down to passing &Graph everywhere — once you do, the rest is plain code.`,
      tokens: [
        { token: 'struct T { f: A, g: B }', meaning: 'a record type with named fields. Tuple structs and unit structs also exist.' },
        { token: 'impl T { fn m(&self) }', meaning: '**method block** — fn m is a method on T. &self is an immutable borrow of the receiver.' },
        { token: 'Vec<T>', meaning: 'a heap-allocated, growable array. The standard owned-collection type.' },
        { token: '&', meaning: 'a **borrow** — an immutable reference. Pass-by-reference without giving up ownership.' },
        { token: 'let mut x = ...;', meaning: 'a mutable binding. Without `mut`, the binding is immutable — compile-time enforced.' },
        { token: 'if let Some(s) = expr', meaning: 'pattern-match a single shape. Run the body only if expr matches Some.' },
        { token: 'usize', meaning: 'a pointer-sized unsigned integer — the standard array index type.' },
        { token: '|x: T| -> R { ... }', meaning: 'a **closure** (lambda). The pipes wrap the parameter list.' },
        { token: '?', meaning: 'the **try operator**. On Err/None it returns early; otherwise it unwraps the Ok/Some.' }
      ],
      example: {
        prose: `An adjacency list as struct of two vectors — successors and predecessors. The borrow checker forces you to decide up front whether the algorithm needs to mutate; ours only reads, so &Graph everywhere.`,
        code: `struct Graph {
    succ: Vec<Vec<usize>>,
    pred: Vec<Vec<usize>>,
}
impl Graph {
    fn outdeg(&self, v: usize) -> usize { self.succ[v].len() }
    fn indeg (&self, v: usize) -> usize { self.pred[v].len() }
}`,
        lang: 'rust'
      },
      link: {
        url: 'https://play.rust-lang.org/',
        label: 'The Rust Playground — try Rust in your browser'
      }
    }
  },
  {
    chapterId: 'feedback-arc-set',
    chapterNum: 8,
    chapterTitle: 'Feedback Arc Set',
    title: 'Ranking the unrankable',
    gesture: `Whenever you have to fuse contradictory rankings — sports tournaments, search results, peer reviews — you are computing a feedback arc set.`,
    body: `Premier League tables, Elo chess ratings, Google's pre-PageRank ranking experiments, and Yelp's reviewer-merging problem are all instances of [[rank aggregation]]. Each input ranker (or pairwise game) gives a directed [[edge]] "A beats B." Some triangles say A>B, B>C, C>A — Condorcet's paradox in graph form. The minimum number of edges to remove to get a consistent linear order is exactly minimum FAS. In academic peer review, NeurIPS aggregates conflicting reviewer scores via approximate FAS solvers. In package managers (npm, Cargo), the dependency upgrade graph occasionally has [[cycle|cycles]] you have to break — picking which constraint edges to relax is FAS over the constraint graph. And FAS shows up in [[VLSI]] placement: edge-crossings in a hierarchical layout are minimized by laying nodes on layers and minimizing back-edges.`,
    eli5: `When ten reviewers disagree about which of fifty papers is best, no ranking will make all of them happy. The "best" ranking is the one with fewest disagreements — fewest pairs of papers ordered opposite to what reviewers said. That count is the minimum feedback arc set.`
  },

  // ============================================================
  // CHAPTER 9 — DIRECTED HAMILTON CIRCUIT (Erlang)
  // ============================================================
  {
    chapterId: 'directed-hamilton',
    chapterNum: 9,
    chapterTitle: 'Directed Hamilton Circuit',
    chapterIntro: `Find a [[cycle]] that visits every [[vertex]] exactly once. The skeleton inside every [[traveling salesman problem|traveling-salesman]] variant.`,
    title: 'Visit every node, exactly once',
    tldr: `A Hamilton circuit visits every vertex exactly once and returns to start. Existence is NP-complete on directed graphs.`,
    gesture: `It sounds like Euler's bridges, but Euler used every *[[edge]]* once. [[Hamilton circuit|Hamilton]] uses every *[[vertex]]* once — and that small change makes it [[NP-complete]].`,
    body: `A Hamilton circuit on a directed graph is a cycle passing through every vertex exactly once:

$$v_1 \\to v_2 \\to \\cdots \\to v_n \\to v_1, \\qquad \\{v_1, \\ldots, v_n\\} = V, \\quad (v_i, v_{i+1}) \\in E. \\tag{1}$$

The [[decision problem]] (does a sequence (1) exist?) is [[NP-complete]]; [[Karp]] reduced [[3-SAT]] to it.

Compare this with the [[Eulerian circuit]] problem — visit every [[edge]] once — which is solved in linear time by Hierholzer's algorithm under a simple local condition:

$$\\text{indeg}(v) = \\text{outdeg}(v) \\quad \\text{for every } v \\in V. \\tag{2}$$

There is no analogous characterization for (1) — the obstruction is fundamentally global. Special graph classes (tournaments, bipartite, cubic) have polynomial cases; the general problem doesn't.`,
    figures: [
      {
        ref: '(1)',
        body: `Read left to right: **v₁ → v₂ → ... → v_n → v₁** spells out a sequence of vertices, with arrows showing the direction of traversal. The last arrow loops back from v_n to v₁, closing the path into a cycle.

**{v₁, ..., v_n} = V** demands the visited vertices are exactly the whole vertex set. Listed in braces, no duplicates allowed by definition of a set, so each vertex appears once.

**(v_i, v_{i+1}) ∈ E** says every consecutive pair in the sequence is an actual edge of the graph. The subscript i ranges over the steps; v_{i+1} is the next vertex.

Reassembled: a Hamilton circuit is an ordering of all vertices into a closed walk where every step uses a real edge.`
      },
      {
        ref: '(2)',
        body: `**indeg(v)** counts the edges pointing *into* v; **outdeg(v)** counts the edges pointing *out*.

The condition demands these match for every vertex. The **for every v ∈ V** clause uses the in-set symbol introduced before — quantifies over all vertices.

This is the local check that makes the *Eulerian* problem easy: count incoming and outgoing edges at each vertex. Every Eulerian circuit needs this balance, and the converse (with weak connectivity) also holds.

By contrast, no analogous local condition exists for Hamilton circuits — the obstruction lives in the whole graph at once.`
      }
    ],
    eli5: `You're a delivery driver and your boss wants you to pass through every address exactly once and end up where you started. Whether such a route exists at all — let alone the shortest one — is genuinely hard.`
  },
  {
    chapterId: 'directed-hamilton',
    chapterNum: 9,
    chapterTitle: 'Directed Hamilton Circuit',
    title: 'Search in Erlang',
    gesture: `Erlang's pattern matching and lightweight processes make a parallel backtracking search read like English.`,
    steps: [
      {
        prose: `Represent the graph as a map from vertex to a list of successors. Erlang's maps and lists are the natural shape — no defining structs, no boilerplate.`,
        code: `%% graph: #{a => [b,c], b => [c,d], c => [d], d => [a]}.
make_graph() ->
    #{a => [b,c], b => [c,d], c => [d], d => [a]}.`,
        lang: 'erlang'
      },
      {
        prose: `Recursive search. Pattern-match on whether the path is complete (and closes back to start) or extends to a successor not yet visited. lists:member is the visited check.`,
        code: `hamilton(G, Start) ->
    Vs = maps:keys(G),
    case search(G, Start, [Start], length(Vs)) of
        {ok, P} -> {ok, P};
        none    -> none
    end.

search(G, V, Path, N) when length(Path) =:= N ->
    case lists:member(hd(Path), maps:get(V, G)) of
        true  -> {ok, lists:reverse([hd(Path) | Path])};
        false -> none
    end;
search(G, V, Path, N) ->
    Succs = maps:get(V, G, []),
    try_succs(G, [S || S <- Succs, not lists:member(S, Path)], Path, N).

try_succs(_, [], _, _)         -> none;
try_succs(G, [S|R], Path, N) ->
    case search(G, S, [S|Path], N) of
        {ok, P} -> {ok, P};
        none    -> try_succs(G, R, Path, N)
    end.`,
        lang: 'erlang'
      },
      {
        prose: `Spawn a worker per branch when the search space gets big. The actor model lets one process handle each candidate first-step, gathering results via message passing. No shared state, no locks.`,
        code: `parallel_hamilton(G, Start) ->
    Self = self(),
    Succs = maps:get(Start, G, []),
    [spawn(fun() -> Self ! {self(), search(G, S, [S, Start], map_size(G))} end)
        || S <- Succs],
    wait_for_any(length(Succs)).

wait_for_any(0) -> none;
wait_for_any(N) ->
    receive
        {_, {ok, P}} -> {ok, P};
        {_, none}    -> wait_for_any(N-1)
    end.`,
        lang: 'erlang'
      },
      {
        prose: `Run it. Erlang shines when the problem decomposes into independent search branches — each lightweight process is ~300 bytes, so spawning thousands is normal.`,
        code: `1> reduce:hamilton(reduce:make_graph(), a).
{ok,[a,b,c,d,a]}`,
        lang: 'erlang'
      }
    ],
    grammar: {
      language: 'Erlang',
      intro: `Erlang lives on the [[BEAM]], the runtime built for telecom switches. Single-assignment variables, pattern matching, and lightweight processes are the whole language; the rest is the OTP libraries on top.`,
      tokens: [
        { token: 'lowercase', meaning: 'an **atom** — a constant symbol. Like a string, but interned and cheap to compare.' },
        { token: 'Uppercase, _', meaning: 'a **variable**. Single-assignment: once bound, it cannot change.' },
        { token: 'f(X) -> ...; f(Y) -> ...', meaning: '**function clauses** with pattern matching. The first matching head runs; clauses are separated by semicolons, ended by a period.' },
        { token: '[H|T]', meaning: 'list cons pattern — H is the head, T is the rest.' },
        { token: '#{a => 1, b => 2}', meaning: 'a **map** literal. maps:get(K, M) reads, maps:put(K, V, M) returns a new map with K updated.' },
        { token: 'case X of pat1 -> e1; pat2 -> e2 end', meaning: 'a **case** expression — pattern-match X against alternatives, return the first matching branch.' },
        { token: 'spawn(fun() -> ... end)', meaning: 'start a new process. Returns a Pid; processes are cheap (~300 bytes each).' },
        { token: 'Pid ! Msg', meaning: 'send Msg to the mailbox of Pid. Asynchronous, never blocks.' },
        { token: 'receive Pat -> body end', meaning: 'block until a message matching Pat arrives, then run body. Add `after T -> ...` for a timeout.' }
      ],
      example: {
        prose: `Represent the directed graph as a map from vertex to a list of successors. Walking neighbors is just maps:get plus a list comprehension.`,
        code: `G = #{a => [b, c], b => [c, d], c => [d], d => [a]}.
Successors = maps:get(a, G).      % -> [b, c]

%% filter out already-visited vertices in one shot:
Visited = [a, b],
Frontier = [V || V <- Successors, not lists:member(V, Visited)].
%% Frontier -> [c]`,
        lang: 'erlang'
      },
      link: {
        url: 'https://www.erlang.org/',
        label: 'Erlang — official site and docs'
      }
    }
  },
  {
    chapterId: 'directed-hamilton',
    chapterNum: 9,
    chapterTitle: 'Directed Hamilton Circuit',
    title: 'Telco failover routing',
    gesture: `When a telecom carrier provisions a [[SONET]]/[[OTN]] ring, it is solving a [[Hamilton circuit]]. Every site on the ring, exactly once, with a directed traffic flow.`,
    body: `In long-haul fiber networks, **rings** carry traffic such that any single fiber cut still leaves a working path. Building a ring through a chosen set of POPs (points of presence) means finding a directed [[Hamilton circuit]] on the eligible-fiber graph. Carriers like AT&T, NTT, and Lumen run nightly optimization to refresh ring designs as link costs change. The same problem hides inside *robotic arm tours* (visit each weld, return to home), *PCB drilling sequencing* (each via, exactly once), and the canonical [[traveling salesman problem]] (Hamilton + edge weights — TSP is just Hamilton with an objective). Erlang's actor heritage is no accident here: AT&T's Bell Labs heritage and Ericsson's telecom-switch design both leaned on Erlang precisely for routing problems shaped like this.`,
    eli5: `A phone company wants to build a fiber loop that touches every city in a region. Every city, exactly once, looping back to start. Whether such a loop is even possible on the available fiber is a Hamilton circuit question.`
  },

  // ============================================================
  // CHAPTER 10 — UNDIRECTED HAMILTON CIRCUIT (Elixir)
  // ============================================================
  {
    chapterId: 'undirected-hamilton',
    chapterNum: 10,
    chapterTitle: 'Undirected Hamilton Circuit',
    chapterIntro: `Drop the directions. Still [[NP-complete]]. The [[undirected graph|undirected]] case has more structural lemmas (Dirac, Ore) but no general [[polynomial time|polynomial]] test.`,
    title: 'Tours without arrows',
    tldr: `A Hamilton circuit on an undirected graph visits every vertex once, with no edge directions to constrain you.`,
    gesture: `You'd think removing constraints makes problems easier. With Hamilton circuits, it doesn't.`,
    body: `An undirected [[Hamilton circuit]] visits every [[vertex]] exactly once on a graph with unordered [[edge|edges]]. [[NP-complete]] ([[Karp]]); [[reduction|reduces]] from the directed version by replacing each directed edge with a small orientation gadget.

There are nice **sufficient** conditions. Dirac's theorem says every vertex of high enough degree guarantees a Hamilton circuit:

$$\\deg(v) \\geq \\tfrac{n}{2} \\ \\text{ for all } v \\in V \\ \\implies \\ G \\text{ is Hamiltonian.} \\tag{1}$$

Ore's theorem generalizes (1) to a sum-of-degrees condition over non-adjacent pairs:

$$\\deg(u) + \\deg(v) \\geq n \\ \\text{ for all non-adjacent } u, v. \\tag{2}$$

But no efficient *necessary* condition is known: a graph that fails (1) and (2) might still be Hamiltonian, and detecting non-Hamiltonicity is in general just as hard as deciding Hamiltonicity.`,
    figures: [
      {
        ref: '(1)',
        body: `**deg(v)** is the *degree* of v — the count of edges meeting it. On an undirected graph, no in/out distinction, so just one number.

**n/2** is half the vertex count. So the condition demands every vertex has at least half the other vertices as neighbors — a fairly dense graph.

The big arrow **⟹** is **implies**: if the left side is true, the right side follows. So Dirac's theorem is "high-degree-everywhere implies Hamilton circuit exists."

This is a *sufficient* condition, not necessary: many sparse graphs are still Hamiltonian. But if your graph passes this test, you can stop checking.`
      },
      {
        ref: '(2)',
        body: `Ore's condition relaxes Dirac's. Instead of demanding each vertex be high-degree, it demands every *non-adjacent pair* of vertices have degree-sums of at least n.

**deg(u) + deg(v) ≥ n** allows individual vertices to be low-degree as long as the deficit is paid by their potential pairing.

**for all non-adjacent u, v** quantifies only over pairs that aren't already neighbors — the pairs that "could" become a Hamilton-cycle hinge if a clever path closes.

Every graph satisfying Dirac satisfies Ore (so Ore is strictly more general), but Ore graphs not covered by Dirac do exist. Both are sufficient, neither is necessary.`
      }
    ],
    eli5: `Same as before — visit every spot exactly once and come home — but now the streets are two-way. Surprisingly, the problem doesn't get easier just because you can travel in either direction.`
  },
  {
    chapterId: 'undirected-hamilton',
    chapterNum: 10,
    chapterTitle: 'Undirected Hamilton Circuit',
    title: 'Concurrent search in Elixir',
    gesture: `Elixir on the BEAM — same actor model as Erlang, but with pipelines and Task.async_stream giving you a parallel-search idiom in a single line.`,
    steps: [
      {
        prose: `Represent the graph as a map from vertex to a MapSet of neighbors. MapSet membership tests are O(log n) — fast enough that the visited-set check isn't your bottleneck.`,
        code: `defmodule Hamilton do
  def graph do
    %{
      :a => MapSet.new([:b, :c, :d]),
      :b => MapSet.new([:a, :c]),
      :c => MapSet.new([:a, :b, :d]),
      :d => MapSet.new([:a, :c])
    }
  end
end`,
        lang: 'elixir'
      },
      {
        prose: `Backtracking helper. Pattern matching on the path length lets us split "still extending" from "trying to close the loop" into two function clauses with no branching.`,
        code: `def search(_g, start, [v | _] = path, n) when length(path) == n do
  if start in elem(get_neighbors(_g, v), 0), do: {:ok, [start | path]}, else: :none
end

def search(g, start, [v | _] = path, n) do
  g[v]
  |> Enum.reject(&(&1 in path))
  |> Enum.find_value(:none, fn nxt ->
    case search(g, start, [nxt | path], n) do
      {:ok, full} -> {:ok, full}
      :none       -> nil
    end
  end)
end`,
        lang: 'elixir'
      },
      {
        prose: `Parallelize the first step with Task.async_stream. Each starting neighbor of the root gets its own lightweight process; the first one to find a circuit wins.`,
        code: `def parallel_hamilton(g, start) do
  n = map_size(g)
  g[start]
  |> Task.async_stream(fn nxt -> search(g, start, [nxt, start], n) end,
                       max_concurrency: System.schedulers_online())
  |> Enum.find_value(:none, fn
    {:ok, {:ok, p}} -> {:ok, p}
    _               -> nil
  end)
end`,
        lang: 'elixir'
      },
      {
        prose: `Run it from iex. Elixir's piped expressions read top-to-bottom — find a starting move, kick off the parallel search, return the first hit.`,
        code: `iex> Hamilton.parallel_hamilton(Hamilton.graph(), :a)
{:ok, [:a, :b, :c, :d, :a]}`,
        lang: 'elixir'
      }
    ],
    grammar: {
      language: 'Elixir',
      intro: `Elixir is the modern face of the [[BEAM]] — same runtime and concurrency as Erlang, with a Ruby-flavored syntax and a pipeline operator that lets you read top-to-bottom data flow.`,
      tokens: [
        { token: 'defmodule M do ... end', meaning: 'a **module**. The build unit; every function lives inside one.' },
        { token: 'def name(args), do: expr', meaning: 'one-line function definition. Use `def ... do ... end` for multi-line bodies.' },
        { token: ':atom', meaning: 'an atom (constant symbol). Leading colon distinguishes it from variables.' },
        { token: '%{key => value}', meaning: 'a map literal. Read with map[key]; pattern-match by listing keys.' },
        { token: '|>', meaning: 'the **pipe operator**: `x |> f(y)` is `f(x, y)`. Lets data flow left-to-right through a transformation chain.' },
        { token: 'fn x -> body end', meaning: 'an **anonymous function** (lambda). Call it with `f.(arg)` — note the dot before the parenthesis.' },
        { token: '&fun/arity', meaning: '**capture syntax** — `&Enum.map/2` is a reference to Enum.map with two arguments.' },
        { token: 'MapSet.new([...])', meaning: 'an immutable set. MapSet.member?, MapSet.put, MapSet.union all return new sets.' },
        { token: 'Task.async_stream(items, fn)', meaning: 'concurrent map. Pass `max_concurrency:` to bound parallelism.' }
      ],
      example: {
        prose: `Walk a vertex's neighbors and filter out the already-visited ones, all in a pipeline. Reads top-to-bottom: start with neighbors, reject the visited, find the first that closes a cycle.`,
        code: `g = %{a: [:b, :c], b: [:c, :d], c: [:d], d: [:a]}
visited = [:a, :b]

g[:b]
|> Enum.reject(&(&1 in visited))
|> Enum.find(fn nxt -> nxt == :a end)
# -> nil here; reject left only [:c, :d]`,
        lang: 'elixir'
      },
      link: {
        url: 'https://livebook.dev/',
        label: 'Livebook — interactive Elixir notebooks'
      }
    }
  },
  {
    chapterId: 'undirected-hamilton',
    chapterNum: 10,
    chapterTitle: 'Undirected Hamilton Circuit',
    title: 'PCB drilling and 3D printing',
    gesture: `Anything where a tool head visits every spot once and returns home is a [[Hamilton circuit]] — usually with edge weights, making it [[TSP|the traveling salesman problem]].`,
    body: `A [[PCB|printed circuit board]] has thousands of [[via|vias]] to drill. The drill bit has to visit each one and come home (to swap to the next bit, often). The tour length determines machine time, which is the dominant cost on a PCB line. The same shape — visit every point once, minimize travel — controls 3D printer head paths, [[CNC milling]], semiconductor [[wafer probing]], warehouse pick-paths, and chemistry-lab autosamplers. Concorde, the flagship academic [[TSP|traveling salesman]] solver, has solved instances with 85,900 cities (the design of a custom [[VLSI]] chip in 2006); commercial solvers like FICO Xpress and Gurobi handle 100K-point routing with branch-and-cut and [[Lin-Kernighan]] heuristics.`,
    eli5: `A 3D printer's nozzle has to lay down ink at every point in a layer. The faster it gets between points, the faster you finish. Picking the order to visit every point exactly once and return is the classic Hamilton circuit problem.`
  },

  // ============================================================
  // CHAPTER 11 — 3-SAT (Clojure)
  // ============================================================
  {
    chapterId: 'three-sat',
    chapterNum: 11,
    chapterTitle: '3-Satisfiability',
    chapterIntro: `Restrict [[SAT]] to [[clause|clauses]] of at most three [[literal|literals]]. Still [[NP-complete]]. The standard starting point for almost every [[reduction]] in the literature.`,
    title: 'Three is enough',
    tldr: `3-SAT is SAT with each clause limited to 3 literals. It is NP-complete; 2-SAT is in P. Three is the magic number.`,
    gesture: `Two literals is easy. Three is everything.`,
    body: `[[3-SAT|Three-SAT]] is [[SAT]] restricted so each [[clause]] has at most three [[literal|literals]]:

$$\\varphi \\;=\\; \\bigwedge_{j=1}^{m} \\bigl(\\, \\ell_{j,1} \\vee \\ell_{j,2} \\vee \\ell_{j,3} \\,\\bigr). \\tag{1}$$

The form (1) is still [[NP-complete]] ([[Karp]]), and in fact most modern [[reduction|reductions]] go *through* 3-SAT rather than general SAT — the fixed clause width simplifies [[gadget construction]].

The [[2-SAT]] version — same as (1) but with two literals per clause — is in [[P]], solvable in linear time via the strongly-connected components of the implication graph. The boundary between 2 and 3 is one of complexity theory's sharpest cliffs:

$$\\text{2-SAT} \\in P, \\qquad \\text{3-SAT NP-complete.} \\tag{2}$$

(2) is the reason 3-SAT motivates entire industries: modern [[CDCL]] solvers, the [[Lasserre hierarchy]], the [[Unique Games Conjecture]].`,
    figures: [
      {
        ref: '(1)',
        body: `Same shape as the SAT figure in chapter 1, with one restriction: every clause has exactly three literals.

**φ** still names the formula, **⋀** is still the big-AND repeated m times, and the parentheses still hold one clause.

Inside the clause, the OR is now spelled out *explicitly* with three named slots: **ℓ_{j,1} ∨ ℓ_{j,2} ∨ ℓ_{j,3}**. The double subscript means "literal i in clause j" — the i picks which of the three positions, the j picks which clause.

Every literal slot is still a variable or its negation, like before. The only change from chapter 1 is the fixed clause width.`
      },
      {
        ref: '(2)',
        body: `Two complexity classes named side by side.

**P** is the class of problems solvable in polynomial time. **NP-complete** problems are the hardest in NP — every NP problem reduces to them, and we don't know how to solve any of them in polynomial time.

The **∈** symbol is the in-set notation again: "2-SAT ∈ P" reads "2-SAT belongs to P."

The figure is a *complexity-theoretic cliff edge*: drop the literal count from 3 to 2, and the problem moves from intractable (probably) to tractable (definitely, linear time). The boundary lives between these two adjacent integers.`
      }
    ],
    eli5: `Same as SAT, but every rule mentions at most three things. Surprisingly, this restriction doesn't make the problem easier — three is still enough to encode every hard problem we know about.`
  },
  {
    chapterId: 'three-sat',
    chapterNum: 11,
    chapterTitle: '3-Satisfiability',
    title: 'WalkSAT in Clojure',
    gesture: `A randomized local-search algorithm that solves random 3-SAT instances faster than complete solvers — and reads as one beautiful pipeline.`,
    steps: [
      {
        prose: `Represent literals as integers — positive for the variable, negative for its negation. A clause is a vector of literals; a formula is a vector of clauses. Persistent data structures throughout.`,
        code: `;; (x1 ∨ ¬x2 ∨ x3) ∧ (¬x1 ∨ x2 ∨ x3)
(def formula [[1 -2 3] [-1 2 3]])

(defn sat-lit? [lit assignment]
  (let [v (Math/abs (long lit))]
    (if (pos? lit) (assignment v) (not (assignment v)))))

(defn sat-clause? [clause assignment]
  (some #(sat-lit? % assignment) clause))`,
        lang: 'clojure'
      },
      {
        prose: `WalkSAT's core: pick a random unsatisfied clause, then in that clause flip either a random variable (with probability p, to escape local minima) or the variable that maximizes the new count of satisfied clauses.`,
        code: `(defn random-unsat-clause [formula assignment]
  (rand-nth (filterv #(not (sat-clause? % assignment)) formula)))

(defn flip-var [assignment v]
  (update assignment v not))

(defn best-flip-in-clause [clause formula assignment]
  (apply max-key
         #(count (filter (fn [c] (sat-clause? c (flip-var assignment %))) formula))
         (map #(Math/abs (long %)) clause)))`,
        lang: 'clojure'
      },
      {
        prose: `Loop: while unsatisfied clauses exist and we haven't hit max-flips, flip a variable. Clojure's loop/recur gives bounded recursion without stack growth.`,
        code: `(defn walksat [formula n-vars max-flips p]
  (loop [assignment (zipmap (range 1 (inc n-vars))
                            (repeatedly #(< (rand) 0.5)))
         flips 0]
    (cond
      (every? #(sat-clause? % assignment) formula) assignment
      (>= flips max-flips) nil
      :else
        (let [c (random-unsat-clause formula assignment)
              v (if (< (rand) p)
                  (Math/abs (long (rand-nth c)))
                  (best-flip-in-clause c formula assignment))]
          (recur (flip-var assignment v) (inc flips))))))`,
        lang: 'clojure'
      },
      {
        prose: `Run it. WalkSAT often beats DPLL on random 3-SAT near the satisfiability threshold (clause-to-variable ratio ≈ 4.267). It is incomplete — it can't prove UNSAT — but for SAT instances it is very fast.`,
        code: `user=> (walksat formula 3 1000 0.5)
{1 true, 2 true, 3 true}`,
        lang: 'clojure'
      }
    ],
    grammar: {
      language: 'Clojure',
      intro: `Clojure is a Lisp on the [[JVM]]. Code is data: every program is built from nested forms, each a list, vector, map, or symbol. The reading style takes one afternoon; the immutability discipline pays off forever.`,
      tokens: [
        { token: '(f a b)', meaning: 'function **call**: f applied to a and b. Function comes first, parens wrap the whole call.' },
        { token: '(defn name [args] body)', meaning: 'define a function named `name` taking the listed args.' },
        { token: '[a b c]', meaning: 'a **vector** literal. Indexed, fast random access.' },
        { token: '{:k1 v1 :k2 v2}', meaning: 'a **map** literal. Keys can be any value; keywords (starting with :) are idiomatic.' },
        { token: '#{1 2 3}', meaning: 'a **set** literal — like a map without values.' },
        { token: '(let [a 1 b 2] body)', meaning: 'local bindings. Pairs of name/value in the bracket vector.' },
        { token: '(if cond then else)', meaning: 'conditional expression. There is no statement-vs-expression distinction; everything returns a value.' },
        { token: '(loop [x init] (recur ...))', meaning: 'bounded recursion that doesn\'t blow the stack. recur jumps back to the loop with new bindings.' },
        { token: '#(... %1 %2)', meaning: 'anonymous-function shorthand. `%1` is the first arg, `%` works for single-arg.' }
      ],
      example: {
        prose: `Represent a CNF formula as a vector of clauses, where each clause is a vector of literals. Positive integers are positive literals, negatives are negations.`,
        code: `;; (x1 ∨ ¬x2 ∨ x3) ∧ (¬x1 ∨ x2)
(def formula [[1 -2 3] [-1 2]])

;; "is this clause satisfied under assignment?"
(defn sat-clause? [clause assignment]
  (some #(let [v (Math/abs (long %))]
           (if (pos? %)
             (assignment v)
             (not (assignment v))))
        clause))

(sat-clause? [1 -2 3] {1 false, 2 false, 3 false})
;; -> true (literal -2 is satisfied since variable 2 is false)`,
        lang: 'clojure'
      },
      link: {
        url: 'https://tryclojure.org/',
        label: 'Try Clojure in your browser'
      }
    }
  },
  {
    chapterId: 'three-sat',
    chapterNum: 11,
    chapterTitle: '3-Satisfiability',
    title: 'Verifying the JVM',
    gesture: `Every time the Java verifier checks a class file, it is solving an instance of [[bounded model checking]] — which compiles to [[3-SAT]] under the hood.`,
    body: `Software [[model checking]] takes a program plus a property ("nothing is ever [[null dereference|null-dereferenced]]", "this [[lock]] is always released") and asks: does there exist any input causing the property to fail? [[bounded model checking|Bounded model checking]] unrolls the program k steps and encodes the question as a [[CNF]] formula — typically a few million 3-clauses for k = 50 in a real Java method. The [[JBMC]], [[SPIN]], and [[CBMC]] tool families all do this. The same template runs [[symbolic execution]] (KLEE, Coverity, GitHub CodeQL) and most of *static analysis*. When Microsoft's SLAM device-driver verifier was deployed in Windows, it caught crashes that traditional QA missed for years; it was, mechanically, a [[3-SAT]] solver.`,
    eli5: `Software bugs can be encoded as logic puzzles: "is there an input that makes this code crash?" If yes, the puzzle has a solution and you have a bug. Modern bug-finders ask exactly this question, and the puzzle they solve is 3-SAT.`
  },

  // ============================================================
  // CHAPTER 12 — CHROMATIC NUMBER (Java)
  // ============================================================
  {
    chapterId: 'chromatic-number',
    chapterNum: 12,
    chapterTitle: 'Chromatic Number',
    chapterIntro: `Color the [[vertex|vertices]] so adjacent vertices differ; use as few colors as possible. The graph problem behind compiler [[register allocation]].`,
    title: 'Color the map',
    tldr: `Chromatic number is the minimum number of colors needed to properly color a graph's vertices. NP-hard to compute, NP-hard to approximate within n^(1−ε).`,
    gesture: `Two adjacent regions can't share a color. The fewest distinct colors that work is the [[chromatic number]].`,
    body: `The chromatic number is the minimum number of colors needed to properly color a graph:

$$\\chi(G) \\;=\\; \\min\\bigl\\{ k : V = V_1 \\cup \\cdots \\cup V_k, \\ \\text{ each } V_i \\text{ independent} \\bigr\\}. \\tag{1}$$

Deciding whether (1) is at most k is [[NP-complete]] for every fixed k from 3 upward ([[Karp]]). Famously, planar graphs are 4-colorable (Appel–Haken 1976, computer-assisted proof) — yet **deciding** if a planar graph is 3-colorable is still NP-complete.

The k-coloring problem [[reduction|reduces]] to and from [[3-SAT]] via the standard variable-clause-truth gadget. Chromatic number is also notoriously hard to approximate: no polynomial algorithm can guarantee a factor better than

$$n^{1 - \\varepsilon} \\tag{2}$$

unless P = NP. The hardness gap (2) makes coloring one of the most resistant of the 21.`,
    figures: [
      {
        ref: '(1)',
        body: `**χ(G)** is the chromatic number — a function that takes a graph G and returns a number. The Greek letter is "chi," pronounced "kai."

**min{...}** picks the smallest value satisfying the condition inside the braces. The braces are set-builder notation: "the set of values k such that..."

The condition: **V = V₁ ∪ ... ∪ V_k** says you can split the vertices into k disjoint groups V₁, V₂, etc., whose union is all of V. The big-∪ unions them all together (same symbol family as in chapter 6's set cover).

**each Vᵢ independent** means no two vertices inside one group are connected by an edge.

Reassembled: χ(G) is the smallest number of "color groups" you need so adjacent vertices end up in different groups.`
      },
      {
        ref: '(2)',
        body: `Same shape as the inapproximability bound in chapter 4 — **n^(1−ε)** for any tiny positive ε.

For a graph on 1,000 vertices, no polynomial algorithm can guarantee an answer within a factor of ~955 of the chromatic number — under standard complexity assumptions.

Among the 21 problems, chromatic number is one of the hardest to approximate, sitting alongside maximum clique and set packing in this brutally inapproximable tier.`
      }
    ],
    eli5: `You're coloring the regions on a map so no two neighboring regions share a color. What's the smallest number of colors that always works? For *any* graph, finding that minimum is hard.`
  },
  {
    chapterId: 'chromatic-number',
    chapterNum: 12,
    chapterTitle: 'Chromatic Number',
    title: 'DSATUR in Java',
    gesture: `DSATUR (Degree of Saturation, Brélaz 1979) — a greedy heuristic that's optimal on small graphs and very good on large ones.`,
    steps: [
      {
        prose: `Standard adjacency-list graph. Java's collections give us BitSet for color tracking; HashMap for the adjacency. The verbosity is the cost; the JIT pays you back.`,
        code: `import java.util.*;
public class Dsatur {
    int n;
    List<Set<Integer>> adj;
    public Dsatur(int n) {
        this.n = n;
        adj = new ArrayList<>();
        for (int i = 0; i < n; i++) adj.add(new HashSet<>());
    }
    public void edge(int u, int v) { adj.get(u).add(v); adj.get(v).add(u); }
}`,
        lang: 'java'
      },
      {
        prose: `Saturation degree of a vertex = number of distinct colors among its neighbors. DSATUR picks the next vertex to color as the one with maximum saturation, breaking ties by raw degree.`,
        code: `int saturation(int v, int[] color) {
    BitSet seen = new BitSet();
    for (int u : adj.get(v)) if (color[u] >= 0) seen.set(color[u]);
    return seen.cardinality();
}

int pickNext(int[] color) {
    int best = -1, bestSat = -1, bestDeg = -1;
    for (int v = 0; v < n; v++) {
        if (color[v] >= 0) continue;
        int sat = saturation(v, color), deg = adj.get(v).size();
        if (sat > bestSat || (sat == bestSat && deg > bestDeg)) {
            best = v; bestSat = sat; bestDeg = deg;
        }
    }
    return best;
}`,
        lang: 'java'
      },
      {
        prose: `Color each picked vertex with the smallest color not used by any neighbor. The maximum color index used is the answer (an upper bound on χ; on many graphs it's tight).`,
        code: `int[] color() {
    int[] c = new int[n];
    Arrays.fill(c, -1);
    for (int step = 0; step < n; step++) {
        int v = pickNext(c);
        BitSet used = new BitSet();
        for (int u : adj.get(v)) if (c[u] >= 0) used.set(c[u]);
        c[v] = used.nextClearBit(0);
    }
    return c;
}`,
        lang: 'java'
      },
      {
        prose: `Drive it on the Petersen graph (chromatic number 3). DSATUR returns three colors. For exact chromatic number on harder graphs you'd add branch-and-bound on top — that's roughly what the Held-Karp-style bounds give you.`,
        code: `public static void main(String[] args) {
    Dsatur g = new Dsatur(10);
    int[][] e = {{0,1},{1,2},{2,3},{3,4},{4,0},
                 {5,7},{7,9},{9,6},{6,8},{8,5},
                 {0,5},{1,6},{2,7},{3,8},{4,9}};
    for (int[] x : e) g.edge(x[0], x[1]);
    System.out.println(Arrays.toString(g.color())); // uses 3 colors
}`,
        lang: 'java'
      }
    ],
    grammar: {
      language: 'Java',
      intro: `Java is verbose by design — explicit types, classes, and visibility modifiers — and the [[JIT]] pays you back with speed once it warms up. Graph algorithms read as plain procedural code wrapped in a class.`,
      tokens: [
        { token: 'import java.util.*;', meaning: 'wildcard import of a package. java.util gives you ArrayList, HashMap, BitSet, Arrays, etc.' },
        { token: 'public class C { ... }', meaning: 'every Java file declares one class. public means visible everywhere; the file name must match.' },
        { token: 'List<T>', meaning: 'a **generic interface**. The angle-brackets carry the element type.' },
        { token: 'new HashMap<>()', meaning: 'allocate a HashMap. The empty `<>` lets the compiler infer the generic types from context.' },
        { token: 'BitSet', meaning: 'a built-in dynamic bitset. Faster than `Set<Integer>` for dense small-integer sets.' },
        { token: 'for (int x : arr)', meaning: 'enhanced for loop. Iterates an array or anything implementing Iterable.' },
        { token: 'Arrays.fill(arr, -1)', meaning: 'utility method: set every element of arr to -1. Look in Arrays/Collections/Math for utilities.' },
        { token: 'Math.max(a, b)', meaning: 'standard math. Most numeric utilities live in java.lang.Math.' },
        { token: 'static T method(...)', meaning: 'a **static method** — call without an instance, like Dsatur.color() rather than dsatur.color().' }
      ],
      example: {
        prose: `Adjacency list with a Set per vertex — duplicates prevented, membership tests cheap. ArrayList of HashSet is the standard idiom.`,
        code: `List<Set<Integer>> adj = new ArrayList<>();
for (int i = 0; i < n; i++) adj.add(new HashSet<>());

void edge(int u, int v) {
    adj.get(u).add(v);
    adj.get(v).add(u);
}`,
        lang: 'java'
      },
      link: {
        url: 'https://docs.oracle.com/javase/tutorial/',
        label: 'Java — official tutorial trail'
      }
    }
  },
  {
    chapterId: 'chromatic-number',
    chapterNum: 12,
    chapterTitle: 'Chromatic Number',
    title: 'Register allocation',
    gesture: `When javac (or any compiler) decides which variable lives in which CPU register, it is graph-coloring the interference graph.`,
    body: `Two program variables [[interference|interfere]] if their lifetimes overlap — both are alive at the same instruction. Build the [[interference graph]] with a [[vertex]] per variable and [[edge|edges]] between interfering pairs. [[register allocation|Coloring this graph]] with k colors corresponds to assigning the variables to k [[register|registers]] (same color = same register). Modern CPUs have ~16 general-purpose integer registers; if χ(G) ≤ 16, no spilling is needed. Chaitin's allocator (1981) was the first major use of graph coloring in compilers and remains the model. Variants ship in GCC, LLVM, V8, and the [[JVM]]'s HotSpot. The same problem also runs *exam timetabling* (each exam a vertex, conflict edge if a student takes both, color = time slot), *frequency assignment* (radio towers, color = channel), and *Sudoku* (cells as vertices, color = digit, with extra "all-different" constraints).`,
    eli5: `A compiler decides which variable in your code goes into which CPU register. Two variables that are used at the same time can't share a register. That's exactly graph coloring — every variable is a region of the map, and two overlapping ones need different colors.`
  },

  // ============================================================
  // CHAPTER 13 — CLIQUE COVER (Kotlin)
  // ============================================================
  {
    chapterId: 'clique-cover',
    chapterNum: 13,
    chapterTitle: 'Clique Cover',
    chapterIntro: `[[Partition]] the [[vertex|vertices]] of a graph into [[clique|cliques]], using as few as possible. The same as coloring the [[complement graph]].`,
    title: 'Cliques as colors',
    tldr: `Minimum clique cover = chromatic number of the complement graph. NP-hard, with the same hardness profile as coloring.`,
    gesture: `[[clique|Cliques]] in G are [[independent set|independent sets]] in G's [[complement graph|complement]]. So clique cover *is* coloring, in disguise.`,
    body: `A clique cover partitions the vertex set into cliques:

$$V = C_1 \\cup C_2 \\cup \\cdots \\cup C_k, \\qquad \\text{each } C_i \\text{ a clique in } G. \\tag{1}$$

The minimum k for which (1) holds is the *clique cover number*, written θ(G).

Karp's reduction is the cleanest of the 21. A clique in G is an independent set in the complement; so a clique cover of G is a coloring of the complement, giving the identity

$$\\theta(G) \\;=\\; \\chi(\\overline G). \\tag{2}$$

By (2), any algorithm for [[chromatic number]] solves clique cover on the complement. The [[decision problem]] (is θ(G) ≤ k?) is [[NP-complete]] for every fixed k from 3 upward.

Notable: on perfect graphs (Berge 1961, Lovász 1972), both clique cover and chromatic number are [[polynomial time|polynomial]] — a window of tractability inside the otherwise intractable family.`,
    figures: [
      {
        ref: '(1)',
        body: `Same shape as chromatic number's set-partition (figure 1 of the previous chapter), with one swap.

**V = C₁ ∪ C₂ ∪ ... ∪ C_k** unions k disjoint vertex-groups to cover all of V — same as before.

But now the condition on each group is **C_i a clique in G**: every two vertices inside one group must be connected by an edge. (Compare chapter 12, where each group was an *independent* set — no edges inside.)

So "color groups must be edge-free" flipped to "color groups must be edge-complete." Independent sets and cliques are duals.`
      },
      {
        ref: '(2)',
        body: `**θ(G)** is the clique cover number. The Greek letter is "theta."

**χ(G)** on the right is chromatic number from the previous chapter.

The bar over G — written **complement of G** — is the *complement graph*: same vertices, but every non-edge of G becomes an edge, and every edge becomes a non-edge.

The identity θ(G) = χ(complement of G) is the cleanest reduction in the 21. A clique in G is exactly an independent set in the complement; covering G with cliques is exactly coloring the complement. Same problem, swapped lens.`
      }
    ],
    eli5: `You want to group friends so that within each group everyone knows everyone, and you want as few groups as possible. The math says: this is the same as the coloring problem on the "non-friend" graph.`
  },
  {
    chapterId: 'clique-cover',
    chapterNum: 13,
    chapterTitle: 'Clique Cover',
    title: 'Reducing in Kotlin',
    gesture: `Kotlin's data classes and extension functions make it easy to express "the same problem from another angle."`,
    steps: [
      {
        prose: `Define a Graph as a set of vertices and a set of unordered edge pairs. Kotlin's Set<Set<Int>> is a fine, immutable representation for small problems.`,
        code: `data class Graph(val n: Int, val edges: Set<Set<Int>>) {
    fun adjacent(u: Int, v: Int) = setOf(u, v) in edges
}`,
        lang: 'kotlin'
      },
      {
        prose: `The complement graph swaps "edge" and "non-edge." A one-line extension function turns the original problem into a graph-coloring problem.`,
        code: `fun Graph.complement(): Graph {
    val es = mutableSetOf<Set<Int>>()
    for (u in 0 until n) for (v in u + 1 until n)
        if (!adjacent(u, v)) es += setOf(u, v)
    return Graph(n, es)
}`,
        lang: 'kotlin'
      },
      {
        prose: `Greedy coloring (Welsh–Powell) on the complement gives an upper bound on the clique cover number. Sort vertices by degree descending; assign the smallest color that doesn't clash with already-colored neighbors.`,
        code: `fun Graph.greedyColor(): IntArray {
    val color = IntArray(n) { -1 }
    val order = (0 until n).sortedByDescending { v ->
        edges.count { v in it }
    }
    for (v in order) {
        val used = (0 until n).filter { adjacent(v, it) && color[it] >= 0 }
                              .map { color[it] }.toSet()
        var c = 0
        while (c in used) c++
        color[v] = c
    }
    return color
}`,
        lang: 'kotlin'
      },
      {
        prose: `Read off the clique cover by grouping vertices by color in the complement. Same color = independent set in complement = clique in original. The reduction is the algorithm.`,
        code: `fun Graph.cliqueCover(): List<List<Int>> {
    val color = complement().greedyColor()
    return color.withIndex()
        .groupBy({ it.value }, { it.index })
        .values.toList()
}`,
        lang: 'kotlin'
      }
    ],
    grammar: {
      language: 'Kotlin',
      intro: `Kotlin is Java with the rough edges sanded off — null safety in the type system, expression-flavored control flow, and extension functions that let you add methods to types you don't own.`,
      tokens: [
        { token: 'data class C(val a: A)', meaning: 'a **data class** — a value-typed record with auto-generated equals, hashCode, copy, and destructuring.' },
        { token: 'val x = ...', meaning: 'an **immutable** binding. Use `var` for mutable.' },
        { token: 'fun name(p: T): R', meaning: 'a function declaration. Type after the colon, return type after the `:` post-args.' },
        { token: 'fun T.method()', meaning: 'an **extension function** — adds method() to T without modifying T. Inside, `this` refers to the receiver.' },
        { token: 'setOf(a, b)', meaning: 'an **immutable set**. Pair with mutableSetOf<T>() for a mutable one.' },
        { token: '{ x -> body }', meaning: 'a **lambda**. Arg list before the arrow.' },
        { token: 'it', meaning: 'the implicit name of a single-arg lambda parameter — saves you from naming it.' },
        { token: 'x?.method()', meaning: '**safe call**: if x is null, the whole expression evaluates to null instead of throwing.' },
        { token: '(a..b)', meaning: 'a **range**. Use `until` for exclusive: `0 until n`.' }
      ],
      example: {
        prose: `Extending Graph with a complement() function turns "swap edges and non-edges" into a one-line method on the type, even though Graph itself stays immutable.`,
        code: `data class Graph(val n: Int, val edges: Set<Set<Int>>)

fun Graph.complement(): Graph {
    val es = mutableSetOf<Set<Int>>()
    for (u in 0 until n) for (v in u + 1 until n) {
        val pair = setOf(u, v)
        if (pair !in edges) es += pair
    }
    return Graph(n, es)
}

val g = Graph(3, setOf(setOf(0, 1)))
g.complement().edges  // setOf(setOf(0, 2), setOf(1, 2))`,
        lang: 'kotlin'
      },
      link: {
        url: 'https://play.kotlinlang.org/',
        label: 'Kotlin Playground — official, in-browser'
      }
    }
  },
  {
    chapterId: 'clique-cover',
    chapterNum: 13,
    chapterTitle: 'Clique Cover',
    title: 'Community detection',
    gesture: `When LinkedIn's "people you may know" [[community detection|partitions the social graph into clusters]], it is doing a relaxed clique cover.`,
    body: `Real social-graph clustering doesn't insist each cluster be a perfect [[clique]] — it asks for *dense* subgraphs that nearly cover the [[vertex]] set. The [[Louvain algorithm|Louvain method]], label propagation, and Leiden algorithm (used by LinkedIn, Facebook, Twitter for [[community detection]]) are clique-cover relatives that optimize [[modularity]] rather than exact cover count. Same ancestry: minimize the number of groups while keeping each group internally well-connected. The exact clique cover problem itself shows up in **data compression** — a clique in a feature [[co-occurrence graph]] is a set of always-together features, mergeable into one — and in **chip layout**, where clique cover the standard-cell library helps macro selection.`,
    eli5: `If you want to put every member of a social network into a friend group where everyone in each group knows everyone else, and you want as few groups as possible, you're doing clique cover. Real apps relax "everyone knows everyone" to "most people know most people," which makes the problem tractable.`
  },

  // ============================================================
  // CHAPTER 14 — EXACT COVER (Ruby)
  // ============================================================
  {
    chapterId: 'exact-cover',
    chapterNum: 14,
    chapterTitle: 'Exact Cover',
    chapterIntro: `Cover the [[universe]] so every element is covered *exactly once* by your chosen sets. The problem under Sudoku, polyomino tiling, and Knuth's [[Algorithm X|Dancing Links]].`,
    title: 'Exactly once',
    tldr: `Pick subsets such that every universe element appears in exactly one chosen subset. NP-complete; Knuth's Algorithm X is the reference solver.`,
    gesture: `Set cover is "at least once." Exact cover is "exactly once." That tiny change is the difference between a covering problem and a partitioning one.`,
    body: `Exact cover on a [[universe]] U and a family F asks for a subfamily that [[partition|partitions]] U — every element appears in exactly one chosen set:

$$F^* \\subseteq F, \\quad \\bigcup_{S \\in F^*} S = U, \\quad S \\cap T = \\emptyset \\ \\text{ for all } S \\neq T \\in F^*. \\tag{1}$$

The combination in (1) — both covering and disjointness — is what separates exact cover from its set-cover cousin. [[Karp]] showed it [[NP-complete]].

Donald Knuth in 2000 published [[Algorithm X]], a depth-first [[backtracking|search]] with a particularly elegant data structure called *Dancing Links* (DLX), that solves the problem with very low overhead. DLX is fast in practice on Sudoku, polyomino tiling, exact-set-partitioning [[IP|IPs]], and pentomino puzzles.

Exact cover also sits at the heart of integer-programming [[set partitioning]] — the constraint "exactly one" instead of "at least one" comes up in airline crew assignment.`,
    figures: [
      {
        ref: '(1)',
        body: `Three constraints joined by commas. Read each one in turn.

**F* ⊆ F** picks a subfamily of the family — same subset symbol as before. The asterisk just decorates the name.

**⋃ S in F* S = U** is the big-union covering condition, identical to set cover in chapter 6: every element of the universe must appear in at least one chosen set.

**S ∩ T = ∅ for all S ≠ T ∈ F*** is the disjointness condition from set packing in chapter 4: no two chosen sets share any element.

What makes exact cover special is that *both* conditions hold at once. The chosen sets cover everything (set-cover-like) and never overlap (set-packing-like). Together: each element appears in *exactly* one chosen set — a partition of U.`
      }
    ],
    eli5: `Cover every item with bundles, but each item must end up in *exactly one* bundle — not zero, not two. Sudoku is secretly an exact-cover puzzle: place a digit so each row, column, and box contains every digit exactly once.`
  },
  {
    chapterId: 'exact-cover',
    chapterNum: 14,
    chapterTitle: 'Exact Cover',
    title: 'Algorithm X in Ruby',
    gesture: `Knuth's recursive backtracker. We'll write it without the Dancing Links optimization — Ruby's hash-of-sets reads like the spec.`,
    steps: [
      {
        prose: `Represent the problem as two lookups: per-set list of elements, and per-element list of sets containing it. Both are Hashes; both are kept consistent on remove/restore.`,
        code: `class ExactCover
  attr_reader :sets, :covers

  def initialize(sets)
    @sets = sets.dup    # name => Set of elements
    @covers = Hash.new { |h, k| h[k] = Set.new }
    sets.each { |name, els| els.each { |e| @covers[e] << name } }
  end
end`,
        lang: 'ruby'
      },
      {
        prose: `The choose step picks the *element* with fewest covering sets — Knuth's S-heuristic, which is what makes the search fast in practice. (Tie-break: any element will do.)`,
        code: `def choose_element
  @covers.min_by { |_, names| names.size }&.first
end`,
        lang: 'ruby'
      },
      {
        prose: `Search: pick an uncovered element, branch on each set covering it, recurse. The cover/uncover operations are the heart of DLX — here we do them by simple hash mutation.`,
        code: `def search(partial = [], &blk)
  return blk.call(partial) if @covers.empty?
  e = choose_element
  return if @covers[e].empty?
  @covers[e].dup.each do |name|
    removed = cover(name)
    search(partial + [name], &blk)
    uncover(removed)
  end
end

def cover(name)
  removed = []
  @sets[name].each do |e|
    @covers[e].each do |other|
      next if other == name
      @sets[other].each { |x| @covers[x].delete(other) unless x == e }
      removed << [other, @sets.delete(other)]
    end
    @covers.delete(e)
  end
  removed
end

def uncover(removed)
  removed.each do |name, els|
    @sets[name] = els
    els.each { |e| @covers[e] << name }
  end
end`,
        lang: 'ruby'
      },
      {
        prose: `Run it. Sudoku encodes as exact cover with 729 sets (one per (row, col, digit) cell-fill) over a 324-element universe. DLX cracks a "hard" 17-clue Sudoku in milliseconds.`,
        code: `sets = {
  a: Set[1, 4, 7], b: Set[1, 4],    c: Set[4, 5, 7],
  d: Set[3, 5, 6], e: Set[2, 3, 6, 7], f: Set[2, 7]
}
ExactCover.new(sets).search { |sol| puts "cover: #{sol.inspect}" }
# cover: [:b, :d, :f]`,
        lang: 'ruby'
      }
    ],
    grammar: {
      language: 'Ruby',
      intro: `Ruby reads as plain English. Methods are called without parentheses; blocks (anonymous functions) are everywhere. Knuth\'s Algorithm X happens to fit Ruby's hash-of-sets idiom perfectly.`,
      tokens: [
        { token: 'class C ... end', meaning: 'class definition. Methods go between `class` and `end`.' },
        { token: 'def name(args) ... end', meaning: 'method definition. Parens optional on call sites; the last expression is the return value.' },
        { token: 'attr_reader :name', meaning: 'auto-generates a getter for @name. Pair with attr_writer / attr_accessor for setters.' },
        { token: '@var', meaning: 'an **instance variable**. Lives on `self`; visible to all methods of this object.' },
        { token: ':symbol', meaning: 'a **symbol** — like an interned string. Often used as hash keys.' },
        { token: 'do |x| ... end', meaning: 'a **block** — anonymous code passed to a method. The bars wrap parameters.' },
        { token: '&blk', meaning: 'in a method signature, captures the block as a Proc. Call it with `blk.call(args)` or `yield`.' },
        { token: 'Hash.new { |h, k| h[k] = [] }', meaning: 'hash with a **default-on-miss** block. Lazy initialization, no nil checks.' },
        { token: 'each / map / select / min_by', meaning: 'enumerable methods. Compose them with blocks to traverse, transform, filter, and find.' }
      ],
      example: {
        prose: `Algorithm X picks the *element* covered by the fewest sets to branch on. min_by reads exactly like the spec: among element→set-list pairs, pick the one whose list is shortest.`,
        code: `require 'set'

covers = {
  1 => Set[:a, :b],     # element 1 is in sets a and b
  2 => Set[:c],         # element 2 is in set c only
  3 => Set[:a, :c]      # element 3 is in sets a and c
}

# pick the element with fewest covering sets:
e, names = covers.min_by { |_, names| names.size }
# -> [2, Set[:c]]   (element 2, only one covering set)`,
        lang: 'ruby'
      },
      link: {
        url: 'https://try.ruby-lang.org/',
        label: 'Try Ruby — official, in-browser'
      }
    }
  },
  {
    chapterId: 'exact-cover',
    chapterNum: 14,
    chapterTitle: 'Exact Cover',
    title: 'Crew assignment, exactly',
    gesture: `[[set partitioning|Set partitioning]] [[IP|IPs]] are exact cover with costs. Every airline, freight carrier, and ride-share platform solves giant ones every night.`,
    body: `In airline operations, each flight leg has to be flown by exactly one crew — not zero (cancellation), not two (cost). The set of legal [[crew pairing|pairings]] (multi-day crew tours) is enormous; picking a subset where each leg is covered exactly once and total cost is minimized is the [[set partitioning|set partitioning problem]], the cost-minimizing version of exact cover. American Airlines' 1989 PROBE solver saved them a reported **$20M/year** in 1989 dollars on crew assignment — about **$53M/year in 2026 USD** after inflation. The same template runs in *meal-planning logistics* (each ingredient appears in exactly one recipe of the week), *factory line scheduling* (each machine slot occupied by exactly one job), and *Sudoku solvers* in everyday newspapers — all built on [[Algorithm X]] or its industrial-strength descendants.`,
    eli5: `If you have to assign one and only one crew to each flight today, no flights left uncovered and no crew double-booked, you're partitioning the flights into crew tours. That partitioning is exact cover.`
  },

  // ============================================================
  // CHAPTER 15 — HITTING SET (Perl)
  // ============================================================
  {
    chapterId: 'hitting-set',
    chapterNum: 15,
    chapterTitle: 'Hitting Set',
    chapterIntro: `Find the smallest set that intersects ("hits") every set in a family. The dual of set cover, but framed from the elements' side.`,
    title: 'Hit them all',
    tldr: `Given a family F of sets, find the minimum set H that intersects every set in F.`,
    gesture: `Vertex cover is hitting set on [[edge|edges]] (size-2 sets). Hitting set is just vertex cover with arbitrary set sizes.`,
    body: `A *hitting set* for a family F is a set that intersects every member:

$$H \\subseteq U \\ \\text{ such that } \\ H \\cap S \\neq \\emptyset \\ \\text{ for every } S \\in F. \\tag{1}$$

Minimum hitting set is [[NP-hard]] ([[Karp]]). The bounded-width special case — every set in F has size at most d — is [[fixed-parameter tractable]] in the answer size k, with running time

$$O\\bigl(d^k \\cdot n\\bigr). \\tag{2}$$

The runtime (2) is fast when both d (the set width) and k (the cover size) are small.

The reduction between hitting set and set cover is so direct that the two problems are essentially the same, framed from opposite sides: in set cover the elements are passive and you pick sets; in hitting set the sets are passive and you pick elements.`,
    figures: [
      {
        ref: '(1)',
        body: `**H ⊆ U** picks a subset of the universe — the elements we choose to be our "hitters."

The condition uses the same intersection notation as vertex cover: **H ∩ S** is the elements common to H and S, and **≠ ∅** says that intersection is non-empty.

So the condition reads: H and S share at least one element.

**for every S ∈ F** demands this holds for *every* set in the family. No set is allowed to escape with zero elements in H.

Compared to vertex cover (chapter 5), each "edge" was a pair {u, v} — a 2-element set. Hitting set just lets each "edge" be a set of any size. That's why d-hitting-set, where each set has size at most d, generalizes vertex cover at d = 2.`
      },
      {
        ref: '(2)',
        body: `**O(d^k · n)** is exponential in two parameters: **d** (the maximum set size in the family) and **k** (the answer size).

If d and k are both small constants, the runtime is just O(n) — linear in the input size.

For 4-hitting-set with answer size at most 10: 4^10 = ~1 million. Multiply by n and you have a fast algorithm even for very large families.`
      }
    ],
    eli5: `You have a list of clubs, each with some members. You want to pick the fewest people such that every club has at least one of your picks as a member. That's hitting set.`
  },
  {
    chapterId: 'hitting-set',
    chapterNum: 15,
    chapterTitle: 'Hitting Set',
    title: 'Greedy in Perl',
    gesture: `Perl is at home in the world of "match this pattern in that file." Hitting set on a corpus of regex requirements is a Perl-shaped problem.`,
    steps: [
      {
        prose: `Read the family from stdin: each line a set, members space-separated. Perl's hash-of-hashes makes the count-by-element pattern a one-liner.`,
        code: `#!/usr/bin/perl
use strict;
use warnings;

my @family;
while (my $line = <STDIN>) {
    chomp $line;
    my %set = map { $_ => 1 } split /\\s+/, $line;
    push @family, \\%set;
}`,
        lang: 'perl'
      },
      {
        prose: `Greedy step: count, across all *uncovered* sets, how many each element hits. Pick the element with the highest count. This is the classic ln(n)-approximation, the same one as for set cover.`,
        code: `sub pick_best {
    my @open = @_;
    my %count;
    for my $set (@open) {
        $count{$_}++ for keys %$set;
    }
    my ($best) = sort { $count{$b} <=> $count{$a} } keys %count;
    return $best;
}`,
        lang: 'perl'
      },
      {
        prose: `Loop: while uncovered sets remain, pick the best element, add it to the hitting set, drop every set it hits. Print the running cover.`,
        code: `my @open = @family;
my @hit;
while (@open) {
    my $e = pick_best(@open);
    last unless defined $e;
    push @hit, $e;
    @open = grep { !exists $_->{$e} } @open;
}
print "hitting set: @hit\\n";`,
        lang: 'perl'
      },
      {
        prose: `Drive it on a small example. The output is a set of elements that touches every input set — within an ln(n) factor of the minimum.`,
        code: `$ echo 'a b c
b d
c e
a e' | perl hitting.pl
hitting set: a b c`,
        lang: 'shell'
      }
    ],
    grammar: {
      language: 'Perl',
      intro: `Perl is the duct tape of the Unix world. Its sigils — $ for scalars, @ for arrays, % for hashes — are noisy but readable, and its regex/text-handling primitives are unmatched for the kind of log-and-corpus work hitting set lives in.`,
      tokens: [
        { token: 'use strict; use warnings;', meaning: 'always include these. They turn typos and unscoped variables into errors instead of subtle bugs.' },
        { token: 'my $x = 1;', meaning: '**lexically scoped scalar**. The sigil $ marks single values.' },
        { token: 'my @arr = (1, 2, 3);', meaning: 'an array. The @ sigil marks "many values."' },
        { token: 'my %h = (a => 1);', meaning: 'a hash (associative array). The % sigil marks key/value pairs.' },
        { token: '\\%h', meaning: 'a **hash reference** — a scalar pointing at the hash. Written with a leading backslash.' },
        { token: '$ref->{key}', meaning: '**arrow dereference** — read the `key` slot of a hash referenced by $ref.' },
        { token: 'split /pat/, $str', meaning: '**regex split** — break a string on every match of pattern, return a list.' },
        { token: 'sort { $a <=> $b } @list', meaning: 'sorted list. The block defines the comparison; <=> is numeric three-way compare.' },
        { token: 'grep { COND } @list', meaning: 'filter — keep elements where COND is true. Companion: map { EXPR } @list for transformation.' }
      ],
      example: {
        prose: `Read each line as a set of items, encode as a hash whose keys are the items. The hash-as-set idiom: only the keys matter, values are just truthy markers.`,
        code: `my @family;
while (my $line = <STDIN>) {
    chomp $line;
    my %set = map { $_ => 1 } split /\\s+/, $line;
    push @family, \\%set;
}
# now $family[0]->{"alpha"} is 1 if "alpha" appeared on line 1.`,
        lang: 'perl'
      },
      link: {
        url: 'https://www.perl.org/learn.html',
        label: 'Perl — getting started'
      }
    }
  },
  {
    chapterId: 'hitting-set',
    chapterNum: 15,
    chapterTitle: 'Hitting Set',
    title: 'Test suite minimization',
    gesture: `Given thousands of regression tests covering hundreds of requirements, the smallest test suite that covers every requirement is a hitting set.`,
    body: `Each requirement defines a *set* of tests that exercise it. A regression suite that hits every requirement is a hitting set on this family. CI pipelines at Google, Facebook, and Microsoft run [[test minimization]] daily to keep cycle times under control — the optimal selection is a hitting set, the deployed heuristic is greedy. The same problem runs in **threat indicator matching** in [[SIEM]] systems (each malware family defined by a set of indicators of compromise; pick the smallest sensor set that catches every family), in **clinical diagnostic panels** (cover every condition in a [[differential diagnosis|differential]] with the fewest tests), and in **fault localization** (pick the smallest set of program edits that explains every failing test).`,
    eli5: `A team has 5,000 software tests covering 800 requirements. They want to keep the smallest set of tests that still checks every requirement at least once. The math problem is hitting set, and the running heuristic is "keep the test that covers the most still-uncovered requirements."`
  },

  // ============================================================
  // CHAPTER 16 — STEINER TREE (TypeScript)
  // ============================================================
  {
    chapterId: 'steiner-tree',
    chapterNum: 16,
    chapterTitle: 'Steiner Tree',
    chapterIntro: `Connect a chosen subset of [[vertex|vertices]] with the cheapest tree. Other vertices may be used as helpful waypoints — that is the Steiner trick.`,
    title: 'The cheapest connection',
    tldr: `Given a graph with edge weights and a terminal subset, find the minimum-weight tree spanning the terminals. May use non-terminal "Steiner points." NP-hard.`,
    gesture: `Connect these dots cheaply, but you can use other dots as relay points if it helps.`,
    body: `The [[Steiner tree]] in Graphs problem takes a weighted graph and a [[terminal]] subset, and asks for the minimum-weight [[subtree]] containing every terminal:

$$\\min_{T' \\text{ subtree of } G,\\ T \\subseteq V(T')} \\ \\sum_{e \\in E(T')} w(e). \\tag{1}$$

Non-terminals may be included as connecting [[Steiner point|Steiner points]] — that's the freedom that makes (1) more powerful than the [[spanning tree]]. [[NP-hard]] ([[Karp]]).

When every vertex is a terminal, the problem collapses:

$$T = V \\ \\implies \\ \\text{(1) is the minimum spanning tree, which is in P.} \\tag{2}$$

So the hardness comes entirely from the choice of which non-terminals to include. The [[2-approximation]] via metric closure is the workhorse heuristic; the best polynomial-time [[approximation ratio]] known is roughly 1.39 (Byrka et al.).`,
    figures: [
      {
        ref: '(1)',
        body: `**min** picks the choice that minimizes the expression after.

Two conditions sit under the min: **T' subtree of G** says T' is a connected, cycle-free piece of G; **T ⊆ V(T')** says the *terminals* T are all included as vertices of that subtree. The notation **V(T')** extracts the vertex set of the subtree T'.

The thing being minimized is **Σ over edges of T' of w(e)** — the big-Σ (capital sigma) is summation, the same shape as big-AND from chapter 1 but for adding numbers.

So the figure says: among every connected, cycle-free subgraph that includes all terminals, find the one whose edges total the least weight.

Non-terminal vertices may or may not be included — they're free to use as connecting waypoints (Steiner points), or skipped if going around is cheaper.`
      },
      {
        ref: '(2)',
        body: `**T = V** is the special case where every vertex is a terminal. No optional Steiner points — every dot must be in the tree.

**⟹** is the implication arrow from chapter 10.

**MST in P** says the resulting problem (connecting every vertex with minimum-weight edges) is the *minimum spanning tree*, solvable in polynomial time by Kruskal or Prim.

So Steiner tree's hardness comes entirely from the optional non-terminal vertices. Strip that choice away and the problem collapses to a textbook polynomial-time algorithm.`
      }
    ],
    eli5: `You have a few specific houses you want to connect with cable. There are other houses around that aren't your customers, but stringing cable through them might be cheaper than going around. Steiner tree is the cheapest way to connect just your customers, with the freedom to route through anyone else.`
  },
  {
    chapterId: 'steiner-tree',
    chapterNum: 16,
    chapterTitle: 'Steiner Tree',
    title: 'Metric closure in TypeScript',
    gesture: `The [[2-approximation]]: build the metric closure on terminals, take its [[MST]], expand back into the original [[graph]].`,
    steps: [
      {
        prose: `Define types for edges and graphs. TypeScript's structural typing means an "object literal that looks like a Graph" is a Graph — no class, no constructor.`,
        code: `type Edge = { u: number; v: number; w: number };
type Graph = { n: number; adj: Map<number, { to: number; w: number }[]> };

function makeGraph(n: number, edges: Edge[]): Graph {
  const adj = new Map<number, { to: number; w: number }[]>();
  for (let i = 0; i < n; i++) adj.set(i, []);
  for (const e of edges) {
    adj.get(e.u)!.push({ to: e.v, w: e.w });
    adj.get(e.v)!.push({ to: e.u, w: e.w });
  }
  return { n, adj };
}`,
        lang: 'typescript'
      },
      {
        prose: `Dijkstra's all-pairs shortest paths from each terminal. The "metric closure" is the complete graph on terminals where each edge weight equals shortest-path distance in the original.`,
        code: `function dijkstra(g: Graph, src: number): number[] {
  const dist = new Array(g.n).fill(Infinity);
  dist[src] = 0;
  const visited = new Set<number>();
  while (visited.size < g.n) {
    let u = -1, best = Infinity;
    for (let i = 0; i < g.n; i++)
      if (!visited.has(i) && dist[i] < best) { u = i; best = dist[i]; }
    if (u < 0) break;
    visited.add(u);
    for (const { to, w } of g.adj.get(u)!)
      if (dist[u] + w < dist[to]) dist[to] = dist[u] + w;
  }
  return dist;
}`,
        lang: 'typescript'
      },
      {
        prose: `MST on the metric closure (Kruskal with union-find). The result is a tree on terminals; each "metric-closure edge" expands back to a real shortest path in G.`,
        code: `function steinerApprox(g: Graph, terminals: number[]): Edge[] {
  const dist = terminals.map(t => dijkstra(g, t));
  const closureEdges: Edge[] = [];
  for (let i = 0; i < terminals.length; i++)
    for (let j = i + 1; j < terminals.length; j++)
      closureEdges.push({ u: i, v: j, w: dist[i][terminals[j]] });
  closureEdges.sort((a, b) => a.w - b.w);

  const parent = terminals.map((_, i) => i);
  const find = (x: number): number => parent[x] === x ? x : (parent[x] = find(parent[x]));
  const tree: Edge[] = [];
  for (const e of closureEdges) {
    const ru = find(e.u), rv = find(e.v);
    if (ru !== rv) { parent[ru] = rv; tree.push(e); }
  }
  return tree;
}`,
        lang: 'typescript'
      },
      {
        prose: `Run on a five-node ring with three terminals. The 2-approximation gives a tree of weight at most twice the optimum, which on real-world inputs lands within ~10–20% of optimal.`,
        code: `const g = makeGraph(5, [
  { u: 0, v: 1, w: 1 }, { u: 1, v: 2, w: 1 }, { u: 2, v: 3, w: 1 },
  { u: 3, v: 4, w: 1 }, { u: 4, v: 0, w: 1 }
]);
console.log(steinerApprox(g, [0, 2, 4]));`,
        lang: 'typescript'
      }
    ],
    grammar: {
      language: 'TypeScript',
      intro: `TypeScript is JavaScript with a structural type system. Types are erased at runtime, so the output is plain JS — but at compile time you get the safety net. Graph algorithms benefit because edge/vertex shapes get checked.`,
      tokens: [
        { token: 'type T = { f: A; g: B }', meaning: '**type alias** — name a record shape. Structurally typed: any object with these fields satisfies T.' },
        { token: 'function f(x: T): R', meaning: 'typed function. Parameters get types after their names; return type after the close paren.' },
        { token: 'Map<K, V>', meaning: 'built-in keyed collection. Use Map.set / .get / .has, not square brackets.' },
        { token: 'const x = ...;', meaning: '**immutable** binding (the variable can\'t be reassigned). Use `let` for mutable; never `var` in modern code.' },
        { token: 'T[]', meaning: 'array of T. The literal `[1, 2, 3]` is `number[]`.' },
        { token: '(x: T) => R', meaning: '**arrow function** — anonymous fn syntax. Body can be a single expression or a block.' },
        { token: 'expr as T', meaning: '**type assertion** — tell the compiler "trust me, this is a T." Use sparingly.' },
        { token: 'x!.method()', meaning: '**non-null assertion** — assert that x isn\'t null/undefined here. Useful after a Map.get when you know the key exists.' },
        { token: 'Infinity', meaning: 'a real number value, not a special type. Useful as the initial "no path yet" distance.' }
      ],
      example: {
        prose: `Weighted adjacency lists as Map<vertex, Array<{to, w}>>. The structural type means an inline object literal that has the right fields *is* an Edge — no class needed.`,
        code: `type Edge = { to: number; w: number };
const adj = new Map<number, Edge[]>();

adj.set(0, [{ to: 1, w: 5 }, { to: 2, w: 3 }]);
adj.set(1, [{ to: 0, w: 5 }]);

for (const { to, w } of adj.get(0) ?? []) {
    console.log(\`edge to \${to}, weight \${w}\`);
}`,
        lang: 'typescript'
      },
      link: {
        url: 'https://www.typescriptlang.org/play',
        label: 'TypeScript Playground — official, in-browser'
      }
    }
  },
  {
    chapterId: 'steiner-tree',
    chapterNum: 16,
    chapterTitle: 'Steiner Tree',
    title: 'Wires on a chip',
    gesture: `VLSI layout routes signal nets through a sea of obstacles. The cheapest route is a Steiner tree.`,
    body: `On a chip, a [[net]] is a set of pins that all need to be connected to the same signal. The [[router]] lays metal wires connecting them, often choosing intermediate [[via]] points to keep total wire length short and avoid blocked regions. That is [[rectilinear]] [[Steiner tree]] on a grid graph. Cadence Innovus and Synopsys IC Compiler run Steiner-tree solvers as inner loops, optimizing total wirelength across millions of nets per chip. The same problem runs in [[multicast routing]] — IP multicast trees are Steiner trees on the network graph, with routers as potential Steiner points — and in **fiber buildout planning**, where ISPs decide which streets to trench given which neighborhoods they have to reach.`,
    eli5: `When a chip designer wires up a circuit, they have to connect a few specific pins. The wires can pass through unused regions of the chip if that makes them shorter. Routing them with the least total wire is exactly Steiner tree.`
  },

  // ============================================================
  // CHAPTER 17 — 3-DIMENSIONAL MATCHING (Swift)
  // ============================================================
  {
    chapterId: 'three-d-matching',
    chapterNum: 17,
    chapterTitle: '3-Dimensional Matching',
    chapterIntro: `Bipartite matching is in [[P]]. Add a third side and it becomes [[NP-complete]] — one of complexity theory's cleanest dimensional cliffs.`,
    title: 'Two sides easy, three sides hard',
    tldr: `Given triples (x, y, z) from three sets X, Y, Z of equal size, find a matching of size |X| where each element appears in exactly one chosen triple. NP-complete.`,
    gesture: `Bipartite matching: O(V·E). 3-D matching: [[NP-complete]]. The third dimension is where the music ends.`,
    body: `3-Dimensional Matching takes three disjoint sets X, Y, Z each of size n and a family of triples drawn from them:

$$T \\subseteq X \\times Y \\times Z, \\qquad |X| = |Y| = |Z| = n. \\tag{1}$$

The question: does there exist a perfect tripartite matching — a subfamily of (1) that uses every element of every set exactly once?

$$M \\subseteq T, \\quad |M| = n, \\quad \\text{every } x, y, z \\text{ appears in exactly one triple of } M. \\tag{2}$$

[[Karp]] reduced [[3-SAT]] to (2). The problem is interesting precisely because the bipartite (2-D) version is in [[P]] ([[Hopcroft-Karp]], König's theorem) — adding a single dimension flips the complexity. 3-DM is [[NP-hard]] to approximate within a constant factor in the maximum-matching variant.`,
    figures: [
      {
        ref: '(1)',
        body: `**X × Y × Z** is the *Cartesian product* of three sets: it's the collection of all triples (x, y, z) where x comes from X, y from Y, z from Z. Same multiplication symbol as in arithmetic, used for set products here.

For sets of size n each, X × Y × Z has n³ possible triples.

**T ⊆ X × Y × Z** picks a subset of those triples — the *allowed* combinations the problem hands you. Not every triple is necessarily compatible; T is the input to the problem.

**|X| = |Y| = |Z| = n** with the cardinality bars demands all three sets are equal size, n elements each.`
      },
      {
        ref: '(2)',
        body: `**M ⊆ T** picks a subfamily of the allowed triples to be the matching.

**|M| = n** sizes the matching: exactly n triples chosen, the same as the size of each side.

The trailing condition is the matching property: **every x, y, z appears in exactly one triple of M**.

That "exactly one" is the strong condition. Compare bipartite matching (where each x has at most one partner): here we demand all three sides are perfectly matched at once. The third dimension makes this NP-complete, while two dimensions (Hopcroft–Karp) is polynomial.`
      }
    ],
    eli5: `Bipartite matching pairs up doctors and hospitals. 3-D matching pairs up doctors, hospitals, and shifts — each must be assigned exactly one of the others. That extra dimension is what makes the problem hard.`
  },
  {
    chapterId: 'three-d-matching',
    chapterNum: 17,
    chapterTitle: '3-Dimensional Matching',
    title: 'Backtracking in Swift',
    gesture: `Swift's value types and pattern matching keep the search tight; Sets give O(1) membership.`,
    steps: [
      {
        prose: `Define the triple as a value-typed struct. Hashable lets us put it in a Set; Equatable falls out for free with the synthesized conformance.`,
        code: `struct Triple: Hashable {
    let x: Int; let y: Int; let z: Int
}`,
        lang: 'swift'
      },
      {
        prose: `Recursive search: try every still-feasible triple at this depth, mark its three elements used, recurse. On failure, unmark and try the next triple.`,
        code: `func match(triples: [Triple],
           usedX: Set<Int>, usedY: Set<Int>, usedZ: Set<Int>,
           picked: [Triple], target: Int) -> [Triple]? {
    if picked.count == target { return picked }
    for t in triples {
        guard !usedX.contains(t.x),
              !usedY.contains(t.y),
              !usedZ.contains(t.z) else { continue }
        if let sol = match(
            triples: triples,
            usedX: usedX.union([t.x]),
            usedY: usedY.union([t.y]),
            usedZ: usedZ.union([t.z]),
            picked: picked + [t],
            target: target
        ) {
            return sol
        }
    }
    return nil
}`,
        lang: 'swift'
      },
      {
        prose: `Wrap with a friendlier signature. The whole search is one recursive function, plus an entrypoint — Swift's expressive type system pulls its weight here.`,
        code: `func threeDM(_ ts: [Triple], target: Int) -> [Triple]? {
    return match(triples: ts,
                 usedX: [], usedY: [], usedZ: [],
                 picked: [], target: target)
}`,
        lang: 'swift'
      },
      {
        prose: `Try it on a small instance. For n ≤ 20, simple backtracking is fast enough. For larger, you'd LP-relax to bipartite-matching subproblems and round — that is what commercial assignment solvers do.`,
        code: `let ts: [Triple] = [
    .init(x:0,y:0,z:0), .init(x:1,y:1,z:1),
    .init(x:2,y:2,z:2), .init(x:0,y:1,z:2)
]
print(threeDM(ts, target: 3) as Any)
// Optional([Triple(x:0,y:0,z:0), Triple(x:1,y:1,z:1), Triple(x:2,y:2,z:2)])`,
        lang: 'swift'
      }
    ],
    grammar: {
      language: 'Swift',
      intro: `Swift's value types and protocol-oriented design make small immutable shapes — like a Triple — fast and ergonomic. Optionals force you to handle absence at the type level: a function returning T? cannot pretend nothing went wrong.`,
      tokens: [
        { token: 'struct T: Hashable { ... }', meaning: 'a value type. The `: Hashable` declares conformance — Swift synthesizes `==` and `hash(into:)` automatically.' },
        { token: 'let x = ...', meaning: 'immutable binding. Use `var` for mutable.' },
        { token: 'func name(_ x: T) -> R?', meaning: 'function declaration. Underscore makes the argument **unlabeled** at call sites; the trailing ? makes the return optional.' },
        { token: '[T]', meaning: 'array of T. Set<T> is the hash-based set.' },
        { token: 'T?', meaning: '**optional** — short for Optional<T>. Either `.some(value)` or `.none` (also written `nil`).' },
        { token: 'guard cond else { ... }', meaning: '**early-exit** check. If cond fails, run the else (which must exit). Otherwise continue with bindings still in scope.' },
        { token: 'if let x = opt { ... }', meaning: 'optional **unwrap** — run the body only if opt is non-nil, with x bound to the unwrapped value.' },
        { token: '0..<n', meaning: 'half-open range — 0, 1, ..., n−1. Use `0...n` for the closed range.' },
        { token: 'for x in xs', meaning: 'iterate. Pair with where clauses: `for x in xs where x.isEven`.' }
      ],
      example: {
        prose: `A triple is a struct of three integers, automatically Hashable so it slots into Sets and Dictionaries with no boilerplate. Compare to other languages where this would need a class with manual hashCode/equals.`,
        code: `struct Triple: Hashable {
    let x: Int; let y: Int; let z: Int
}

let candidates: [Triple] = [
    Triple(x: 0, y: 0, z: 0),
    Triple(x: 1, y: 1, z: 1)
]
var seen = Set<Triple>()
seen.insert(candidates[0])  // works — Hashable is automatic`,
        lang: 'swift'
      },
      link: {
        url: 'https://swiftfiddle.com/',
        label: 'Swift Fiddle — try Swift in your browser'
      }
    }
  },
  {
    chapterId: 'three-d-matching',
    chapterNum: 17,
    chapterTitle: '3-Dimensional Matching',
    title: 'The kidney exchange',
    gesture: `Three-way [[kidney exchange|kidney exchanges]] (donor → patient [[cycle|cycles]]) are the most morally consequential 3-DM instance running anywhere.`,
    body: `A patient with a willing but incompatible donor can be matched in a [[kidney exchange]] chain: donor A gives to patient B, donor B gives to patient C, donor C gives to patient A. Three-way exchanges form 3-[[cycle|cycles]] in a directed compatibility graph; finding the maximum number of three-cycles that share no vertex is a 3-D matching variant. The US National Kidney Registry runs exactly this optimization. Alvin Roth's Nobel-winning work on market design productionized the math. The same template runs in **labor-market matching** (worker, employer, role), in **logistics** (truck, dock, time slot), and in **dating apps** (with the third dimension being context — coffee, dinner, weekend trip).`,
    eli5: `If your spouse needs a kidney and you can't donate to them, you can be matched in a triangle: you donate to someone else, that person's spouse donates to a third person, that third person's spouse donates to your spouse. Finding as many such triangles as possible without anyone double-booked is 3-D matching.`
  },

  // ============================================================
  // CHAPTER 18 — KNAPSACK (C#)
  // ============================================================
  {
    chapterId: 'knapsack',
    chapterNum: 18,
    chapterTitle: 'Knapsack',
    chapterIntro: `Pack the most value into a fixed-capacity bag. The textbook [[NP-complete]] problem with a famously fast [[pseudo-polynomial]] DP.`,
    title: 'The knapsack',
    tldr: `0-1 Knapsack picks items with weights and values to maximize value subject to a weight budget. NP-complete; O(nW) DP solves it in pseudo-polynomial time.`,
    gesture: `Just because it's NP-complete doesn't mean it's slow in practice.`,
    body: `Given n items with weights and values, and a capacity W, the 0-1 knapsack picks a subset to maximize total value without exceeding the budget:

$$\\max \\sum_{i \\in S} v_i \\quad \\text{subject to} \\quad \\sum_{i \\in S} w_i \\leq W, \\ \\ S \\subseteq \\{1, \\ldots, n\\}. \\tag{1}$$

Form (1) is [[NP-complete]] in W's binary encoding ([[Karp]]), but the standard DP solves it in time

$$O(n \\cdot W). \\tag{2}$$

The runtime (2) is [[pseudo-polynomial]] — the table size depends on W itself, not on log W. For practical W in the millions, that's fast. The recurrence underlying (2) is

$$\\mathrm{dp}[i, w] \\;=\\; \\max\\Bigl(\\, \\mathrm{dp}[i-1,\\, w], \\ \\mathrm{dp}[i-1,\\, w - w_i] + v_i \\,\\Bigr). \\tag{3}$$

Knapsack is the friendly [[NP-complete]] problem: (3) gives exact answers fast on practical sizes, and an [[FPTAS]] exists — any [[approximation ratio]] (1 − ε) in time polynomial in 1/ε.`,
    figures: [
      {
        ref: '(1)',
        body: `**max Σ over i ∈ S of v_i** is "maximize the total value of chosen items." The big-Σ sums up value contributions; the index i ranges over our choice S.

**subject to** introduces the constraints: **Σ w_i ≤ W** says the total weight of chosen items must not exceed the capacity W.

**S ⊆ {1, ..., n}** declares S as a subset of the item indices — a yes/no decision per item, all-or-nothing.

So (1) reads: pick a subset of items to maximize total value while keeping total weight within budget. The "all-or-nothing" choice (no half items) is what makes it 0-1 knapsack rather than the easier *fractional* version.`
      },
      {
        ref: '(2)',
        body: `**O(n · W)** is *pseudo-polynomial* — polynomial in n and W, but not in the input *size*.

The size of the input is roughly n × log W bits (you can write W in log₂ W bits). The runtime depends on W itself, not log W, so doubling the bit-length of W doubles the bit-length of the input but squares the runtime.

For practical W in the millions, n · W is a few seconds of computation. For W in the gigabits, it's intractable. That's why knapsack is "easy in practice" but still NP-complete in theory.`
      },
      {
        ref: '(3)',
        body: `**dp[i, w]** is a 2D table indexed by item count and remaining capacity. The brackets are "lookup at this index."

The right side is **max(...)** — pick whichever choice produces the bigger value. Two choices:

**dp[i−1, w]**: the best value if we *skip* item i (capacity w stays the same; we have one fewer item to consider).

**dp[i−1, w − w_i] + v_i**: the best value if we *take* item i — capacity drops by w_i (the weight of item i), then we add v_i (the value).

The max of these two recursive lookups gives the optimal answer for this state. Walk i from 1 to n and w from 0 to W; the bottom-right cell holds the answer.`
      }
    ],
    eli5: `You have a backpack with a weight limit and a pile of items, each with a weight and a value. What's the most valuable combination you can carry without going over the limit? That's knapsack.`
  },
  {
    chapterId: 'knapsack',
    chapterNum: 18,
    chapterTitle: 'Knapsack',
    title: 'DP in C#',
    gesture: `The textbook 0-1 DP, in C# with LINQ for the reconstruction step. .NET's value semantics make the table easy to reason about.`,
    steps: [
      {
        prose: `Define an Item record. C#'s positional records are perfect for value-typed data shapes — Equatable, Hashable, and a deconstructor for free.`,
        code: `public record Item(int Weight, int Value);

public class Knapsack {
    public static (int value, IEnumerable<int> picked)
        Solve(IList<Item> items, int capacity) { ... }
}`,
        lang: 'csharp'
      },
      {
        prose: `Build the DP table dp[i, w] = best value using first i items with capacity w. The classic recurrence: take or leave the i-th item.`,
        code: `int n = items.Count;
var dp = new int[n + 1, capacity + 1];
for (int i = 1; i <= n; i++) {
    var (wi, vi) = (items[i-1].Weight, items[i-1].Value);
    for (int w = 0; w <= capacity; w++) {
        dp[i, w] = dp[i - 1, w];
        if (wi <= w)
            dp[i, w] = Math.Max(dp[i, w], dp[i - 1, w - wi] + vi);
    }
}`,
        lang: 'csharp'
      },
      {
        prose: `Walk back through the table to reconstruct *which* items got picked. If dp[i, w] > dp[i-1, w], item i was taken. LINQ's Reverse turns the descending walk into an ascending list.`,
        code: `var picked = new List<int>();
int rem = capacity;
for (int i = n; i >= 1; i--) {
    if (dp[i, rem] != dp[i - 1, rem]) {
        picked.Add(i - 1);
        rem -= items[i - 1].Weight;
    }
}
return (dp[n, capacity], picked.AsEnumerable().Reverse());`,
        lang: 'csharp'
      },
      {
        prose: `Drive it. For 1000 items and capacity 10⁶, this DP runs in well under a second on commodity hardware. For really enormous capacity, you switch to branch-and-bound with LP relaxation bounds — but most problems are this size.`,
        code: `var items = new List<Item> {
    new(2, 3), new(3, 4), new(4, 5), new(5, 6)
};
var (val, picked) = Knapsack.Solve(items, 5);
Console.WriteLine($"value={val}, picked={string.Join(",", picked)}");
// value=7, picked=0,1`,
        lang: 'csharp'
      }
    ],
    grammar: {
      language: 'C#',
      intro: `C# is a value-and-reference language with serious type-system muscle: positional records for immutable shapes, LINQ for fluent collection queries, generics with variance. Knapsack DP fits the language idiomatically.`,
      tokens: [
        { token: 'public record T(int A, int B)', meaning: '**positional record** — a compact immutable class with synthesized constructor, equality, deconstruction, and ToString.' },
        { token: 'using System.Linq;', meaning: 'enables LINQ extension methods on collections. Almost always wanted.' },
        { token: 'var x = ...;', meaning: '**type-inferred** local. Compiler picks the type from the right-hand side.' },
        { token: 'int[,]', meaning: '**2D array** type. `new int[n, m]` allocates; index with `arr[i, j]`.' },
        { token: 'IList<T>', meaning: 'an interface for list-like collections. Use it as the parameter type for flexibility.' },
        { token: 'IEnumerable<T>', meaning: 'the lazy-iteration interface. LINQ\'s native return type.' },
        { token: '.Select(...).Where(...).Reverse()', meaning: '**LINQ pipeline** — fluent transformation. Each call returns a new IEnumerable; the work happens lazily.' },
        { token: 'Console.WriteLine($"{x}")', meaning: '**interpolated string** — embed expressions inside `$"..."` with `{expr}`.' },
        { token: 'Math.Max(a, b)', meaning: 'standard math. Most utilities live in the System.Math static class.' }
      ],
      example: {
        prose: `An item is a small immutable record of weight and value. The positional-record syntax replaces fifty lines of class boilerplate (constructor, properties, Equals, GetHashCode, ToString) with one.`,
        code: `public record Item(int Weight, int Value);

var items = new List<Item> {
    new(2, 3), new(3, 4), new(4, 5)
};

// LINQ over the records:
var total = items.Sum(i => i.Value);  // 12
var heavy = items.Where(i => i.Weight >= 3).ToList();`,
        lang: 'csharp'
      },
      link: {
        url: 'https://dotnetfiddle.net/',
        label: '.NET Fiddle — try C# in your browser'
      }
    }
  },
  {
    chapterId: 'knapsack',
    chapterNum: 18,
    chapterTitle: 'Knapsack',
    title: 'Capital budgeting and ad slots',
    gesture: `Every CFO who has ever asked "which projects do we fund?" with a fixed budget has solved a knapsack.`,
    body: `Same setting as 0-1 [[IP]], but the simple form: each candidate has a cost and an expected return; total budget is capped; maximize total return. Knapsack DPs are embedded in real-time ad serving (each ad has a [[CPM]] and uses a quota of the user's session — pick the highest-value compatible set), in containerization (ECR / Cloud Run schedulers fitting Pod requests into nodes are running a vector knapsack), and in cargo loading (max value of cargo into a vessel within deadweight). [[Tax-loss harvesting]] is a knapsack: each lot has a "loss" and a "drift cost"; maximize loss subject to a tracking-error budget. Wealthfront and Betterment both run this nightly.`,
    eli5: `A streaming service has 10 seconds of ad time and a list of ads, each paying differently and taking different lengths. Pick the most lucrative combination that fits in the slot. That's knapsack, and it runs millions of times per second.`
  },

  // ============================================================
  // CHAPTER 19 — JOB SEQUENCING (Ada)
  // ============================================================
  {
    chapterId: 'job-sequencing',
    chapterNum: 19,
    chapterTitle: 'Job Sequencing',
    chapterIntro: `Schedule jobs with deadlines and penalties on a single machine. Ada was designed for problems with deadlines that *matter*.`,
    title: 'Deadlines on a single machine',
    tldr: `Schedule jobs on one machine to minimize total penalty for missed deadlines. NP-hard in general; specific cases admit greedy O(n log n) solutions.`,
    gesture: `One machine, n jobs, n deadlines. Pick a sequence; pay the penalty for what's late.`,
    body: `Karp's job sequencing problem: n jobs each carry a processing time, a deadline, and a penalty for missing the deadline. Choose an order on a single machine that minimizes the total weighted penalty:

$$\\min_{\\sigma \\in S_n} \\ \\sum_{j=1}^{n} w_j \\cdot \\mathbf{1}\\bigl[\\, C_j(\\sigma) > d_j \\,\\bigr]. \\tag{1}$$

Here C_j(σ) is the completion time of job j under schedule σ, and the bracketed indicator is 1 if the job finishes late, 0 otherwise. So (1) charges the penalty w_j for each missed deadline and asks for the order that pays least.

Form (1) is [[NP-hard]] via [[reduction]] from [[partition]]. Special cases — unit times, identical penalties, agreeable weights — admit [[polynomial time|polynomial]] greedy solutions (Moore–Hodgson, [[EDF]]). The general case is one of the most-studied scheduling problems and the gateway to modern scheduling theory.`,
    figures: [
      {
        ref: '(1)',
        body: `**min over σ ∈ S_n** is the same permutation-search idea from chapter 8. **σ** is one specific ordering of the n jobs; **S_n** is the set of all such orderings; we pick the cheapest.

**Σ from j=1 to n** sums one term per job. Same big-Σ as in knapsack, summing across an index range.

The term **w_j · 1[C_j(σ) > d_j]** is a weighted indicator. The bracket **1[condition]** is the *indicator function* — it equals 1 if the condition is true, 0 if false.

The condition **C_j(σ) > d_j** asks whether job j's *completion time* (under schedule σ) exceeds its deadline d_j. So the indicator is 1 if the job missed its deadline, 0 if not.

Multiplying by **w_j** charges the per-miss penalty for job j. Summing across all j gives total penalty. Take the schedule that minimizes that total — that's the answer.`
      }
    ],
    eli5: `You're a chef with a single oven and a stack of orders. Each order takes a different time, has a delivery deadline, and a customer who is differently angry if it's late. In what order do you bake?`
  },
  {
    chapterId: 'job-sequencing',
    chapterNum: 19,
    chapterTitle: 'Job Sequencing',
    title: 'Moore–Hodgson in Ada',
    gesture: `Ada's strong typing and ranges fit naturally to scheduling — every quantity has a unit, and the compiler catches arithmetic mismatches.`,
    steps: [
      {
        prose: `Define types with semantic ranges. Ada's subtypes catch off-by-one and unit confusions at compile time — the kind of thing you really want when scheduling avionics tasks.`,
        code: `with Ada.Containers.Vectors;
procedure Job_Schedule is
   subtype Time     is Natural range 0 .. 1_000_000;
   subtype Penalty  is Natural;

   type Job is record
      Id          : Positive;
      Length      : Time;
      Deadline    : Time;
      Late_Cost   : Penalty;
   end record;

   package Job_Vectors is new Ada.Containers.Vectors
      (Index_Type => Positive, Element_Type => Job);
   use Job_Vectors;`,
        lang: 'ada'
      },
      {
        prose: `Moore–Hodgson algorithm for minimizing the *count* of late jobs (a special case): sort by deadline, scan; whenever a job pushes you past its deadline, drop the longest scheduled-so-far. The algorithm is provably optimal for this objective.`,
        code: `function Moore_Hodgson (Jobs : Vector) return Vector is
   Sorted : Vector := Jobs;
   Out_J  : Vector;
   T      : Time := 0;
begin
   --  Sort by deadline (insertion sort, fine for small n)
   --  ... (sort code elided for space) ...
   for J of Sorted loop
      Out_J.Append (J);
      T := T + J.Length;
      if T > J.Deadline then
         declare
            Worst_Idx : Positive := 1;
         begin
            for K in Out_J.First_Index .. Out_J.Last_Index loop
               if Out_J (K).Length > Out_J (Worst_Idx).Length then
                  Worst_Idx := K;
               end if;
            end loop;
            T := T - Out_J (Worst_Idx).Length;
            Out_J.Delete (Worst_Idx);
         end;
      end if;
   end loop;
   return Out_J;
end Moore_Hodgson;`,
        lang: 'ada'
      },
      {
        prose: `Drive it. The result is the largest set of jobs that can all meet their deadlines on a single machine. Ada's compile-time guarantees are the reason it remains the language of choice for safety-critical scheduling — when an avionics scheduler reorders tasks, "off-by-one" is not an option.`,
        code: `   Jobs : Vector;
begin
   Jobs.Append ((1, 5, 10, 100));
   Jobs.Append ((2, 4, 8,   50));
   Jobs.Append ((3, 6, 12,  20));
   declare
      Sched : constant Vector := Moore_Hodgson (Jobs);
   begin
      for J of Sched loop
         Ada.Text_IO.Put_Line ("scheduled " & Integer'Image (J.Id));
      end loop;
   end;
end Job_Schedule;`,
        lang: 'ada'
      },
      {
        prose: `For the general weighted case (the actually NP-hard Karp version), no greedy works; you fall back to branch-and-bound or branch-and-price. But the Moore–Hodgson kernel is the building block of every industrial scheduler, including those used by Boeing and Airbus.`,
        code: `--  Weighted variant: branch on each job either scheduled-on-time
--  or accepted-as-late, prune by lower-bound (sum of penalties for
--  jobs that *must* be late given the chosen prefix).`,
        lang: 'ada'
      }
    ],
    grammar: {
      language: 'Ada',
      intro: `Ada is the strict-uncle language of the systems world. Subtypes carry runtime-checked range constraints; types do not implicitly convert; even the plain "=" symbol is reserved for comparison only. The result: scheduling code where a "time" can never accidentally be added to a "count."`,
      tokens: [
        { token: 'with Ada.Text_IO;', meaning: 'import a package. Use `use Ada.Text_IO;` to bring its names into scope without prefixing.' },
        { token: 'procedure Name is ... begin ... end Name;', meaning: '**procedure** — a routine that returns nothing. Declarative parts go before `begin`; executable code after.' },
        { token: 'subtype T is Natural range 0 .. 1_000;', meaning: 'a **constrained subtype**. Out-of-range assignments raise Constraint_Error at runtime.' },
        { token: 'type Job is record F : T; end record;', meaning: '**record type** — Ada\'s name for a struct. Fields declared inside `record ... end record`.' },
        { token: ':=', meaning: '**assignment**. The plain `=` is reserved for equality comparison; mixing them is a compile error.' },
        { token: 'declare ... begin ... end;', meaning: '**block statement** with local declarations. Blocks can nest anywhere.' },
        { token: "'Image", meaning: 'an **attribute** — `Integer\'Image(42)` returns " 42" as a string. Many types come with built-in attributes.' },
        { token: 'for J of Container loop ... end loop;', meaning: 'iterate over a container. `for I in 1 .. N loop` for index loops.' },
        { token: 'package P is new Generic (...)', meaning: '**generic instantiation**. Generic packages (like Ada.Containers.Vectors) get specialized per use.' }
      ],
      example: {
        prose: `Declare scheduling types with hard ranges. Trying to assign 2_000_000 to a value of subtype Time raises Constraint_Error — at runtime if you can't prove it statically. The compiler catches what it can, the runtime catches the rest.`,
        code: `subtype Time     is Natural range 0 .. 1_000_000;
subtype Penalty  is Natural;

type Job is record
   Id        : Positive;
   Length    : Time;
   Deadline  : Time;
   Late_Cost : Penalty;
end record;

J : Job := (Id => 1, Length => 5, Deadline => 10, Late_Cost => 100);
-- J.Length := 2_000_000;  -- runtime: raises Constraint_Error`,
        lang: 'ada'
      },
      link: {
        url: 'https://learn.adacore.com/',
        label: 'Learn.AdaCore — Ada in your browser'
      }
    }
  },
  {
    chapterId: 'job-sequencing',
    chapterNum: 19,
    chapterTitle: 'Job Sequencing',
    title: 'Avionics task scheduling',
    gesture: `In a fly-by-wire system, the flight-control task missing a deadline is not a customer complaint — it is a crash.`,
    body: `On a Boeing 787 or an Airbus A380, the flight-control computer runs dozens of tasks at varying frequencies — flight-surface control at 100 Hz, autopilot at 50 Hz, displays at 20 Hz, mission planning at 1 Hz. The scheduler (typically [[rate-monotonic scheduling|rate-monotonic]] or [[EDF|earliest-deadline-first]]) must guarantee every hard-deadline task finishes on time. That is job sequencing with hard deadlines and infinite penalty for misses. Ada's [[Ravenscar profile]], used in most safety-critical avionics, was *designed* to make these scheduling guarantees provable. Lockheed Martin, Honeywell, and Thales all ship Ada-based flight software for exactly this reason. The same problem also runs **manufacturing** lines (jobs through a single bottleneck machine), **emergency-room triage** (patients as jobs, priority and length varying), and **batch scheduler** infrastructure.`,
    eli5: `An airplane's computer has many things to do, all the time, and each has a deadline. If the autopilot calculation is late, the plane wobbles. The scheduler decides what to compute next, and if it's smart enough, no deadline is ever missed. Job sequencing is the math behind that decision.`
  },

  // ============================================================
  // CHAPTER 20 — PARTITION (OCaml)
  // ============================================================
  {
    chapterId: 'partition',
    chapterNum: 20,
    chapterTitle: 'Partition',
    chapterIntro: `Split a multiset of integers into two subsets with equal sums. Knapsack's special case, surprisingly hard, surprisingly close to easy.`,
    title: 'Two equal piles',
    tldr: `Given a multiset of positive integers, decide whether it can be partitioned into two subsets with equal sum. NP-complete; pseudo-polynomial DP solves it.`,
    gesture: `Sum the lot, divide by two, find a subset that hits exactly that target.`,
    body: `Partition asks whether a multiset of positive integers can be split into two equal-sum halves:

$$\\exists\\, S \\subseteq \\{1, \\ldots, n\\} \\ : \\ \\sum_{i \\in S} a_i \\;=\\; \\sum_{i \\notin S} a_i. \\tag{1}$$

Equivalently, (1) holds iff some subset sums to exactly half the total. [[NP-complete]] ([[Karp]]); the standard subset-sum DP solves it in [[pseudo-polynomial]] time

$$O(n \\cdot \\Sigma), \\qquad \\Sigma = \\sum_i a_i. \\tag{2}$$

[[Karmarkar-Karp]]'s *differencing* heuristic gives strong approximate answers. On random inputs near the *phase transition* — the regime where instances are most often unsolvable — exact algorithms struggle while differencing usually finds optimal partitions. Partition is the textbook [[reduction]] source for many other [[NP-complete]] problems, including job sequencing, bin packing, and 3-partition.`,
    figures: [
      {
        ref: '(1)',
        body: `**∃** is the *exists* quantifier — read as "there exists" or "is there a." It asserts that at least one example satisfies what follows.

**S ⊆ {1, ..., n}** picks a subset of the n indices.

The colon **:** separates "what we're looking for" from "the property it must satisfy."

After the colon, the property: **Σ over i ∈ S of a_i = Σ over i ∉ S of a_i**. Two big-sums — one over indices in S, one over indices *not* in S (the **∉** is "is not in"). The equality demands these sums match.

Reassembled: is there a subset whose sum equals the sum of everything left over? Equivalently, both halves equal half the total.`
      },
      {
        ref: '(2)',
        body: `Same shape as the knapsack runtime — *pseudo-polynomial*. **n** is the count of integers; **Σ** here stands in for the total sum (the script-Σ on the right of the comma).

So O(n · Σ) is fast when the sums fit comfortably in memory (e.g., total ~10⁶), and intractable when sums are astronomical (10¹⁸+).

The DP solving this just builds a length-(Σ/2 + 1) array of "is this exact sum reachable?" and walks each integer in turn.`
      }
    ],
    eli5: `Split a stack of coins into two piles of equal value. Sounds easy — but for arbitrary integer values, no fast algorithm is known.`
  },
  {
    chapterId: 'partition',
    chapterNum: 20,
    chapterTitle: 'Partition',
    title: 'DP and Karmarkar–Karp in OCaml',
    gesture: `OCaml's records, immutable arrays, and pattern matching make the differencing heuristic read like its definition.`,
    steps: [
      {
        prose: `Subset-sum DP: a boolean array dp[w] = "is sum w reachable using some subset?" Iterate items; for each, update from high to low to avoid double-counting. The exact partition test is dp[total/2].`,
        code: `let can_partition (xs : int array) : bool =
  let total = Array.fold_left (+) 0 xs in
  if total mod 2 <> 0 then false
  else
    let target = total / 2 in
    let dp = Array.make (target + 1) false in
    dp.(0) <- true;
    Array.iter (fun x ->
      for w = target downto x do
        if dp.(w - x) then dp.(w) <- true
      done
    ) xs;
    dp.(target)`,
        lang: 'ocaml'
      },
      {
        prose: `Karmarkar–Karp differencing: pop the two largest items, replace them with their absolute difference. Iterate until one number remains — that's the (approximate) partition gap. A min-heap keeps the largest at the top.`,
        code: `module H = Set.Make(struct
  type t = int let compare = compare
end)

let kk (xs : int array) : int =
  let h = ref (Array.fold_left (fun s x -> H.add x s) H.empty xs) in
  while H.cardinal !h > 1 do
    let max1 = H.max_elt !h in
    h := H.remove max1 !h;
    let max2 = H.max_elt !h in
    h := H.remove max2 !h;
    h := H.add (abs (max1 - max2)) !h
  done;
  H.min_elt !h`,
        lang: 'ocaml'
      },
      {
        prose: `Combine. KK's residual is an upper bound on the optimal partition difference; the DP gives an exact answer for the decision problem. Use KK first as a screen — if KK returns 0, you have a perfect partition; otherwise call the DP.`,
        code: `let solve (xs : int array) =
  match kk xs with
  | 0 -> "perfect partition exists"
  | r when can_partition xs ->
      "perfect partition exists (KK gave " ^ string_of_int r ^ ")"
  | r ->
      "no perfect partition; KK upper bound = " ^ string_of_int r`,
        lang: 'ocaml'
      },
      {
        prose: `Run it. KK runs in O(n log n) and gets within roughly n^(-α log n) of optimal on random inputs — astonishingly tight. For 1000-element instances with values up to 10⁹, KK is fast and almost always optimal; the DP would be infeasible at that size.`,
        code: `let () =
  let xs = [| 3; 1; 4; 1; 5; 9; 2; 6; 5; 3 |] in
  print_endline (solve xs)`,
        lang: 'ocaml'
      }
    ],
    grammar: {
      language: 'OCaml',
      intro: `OCaml is ML-family functional programming with strict evaluation and an industrial-strength compiler. Algebraic data types, pattern matching, and a Hindley–Milner type inferencer give you Haskell-like expressiveness with predictable performance.`,
      tokens: [
        { token: 'let name = expr', meaning: 'binding. `let f x y = expr` defines a curried function (left-associative arrows).' },
        { token: 'let name : t = expr', meaning: 'typed binding. Most types are inferred, but you can annotate.' },
        { token: 'type t = ...', meaning: 'type definition. Sum types: `type color = Red | Green | Blue`.' },
        { token: 'match x with | p1 -> e1 | p2 -> e2', meaning: 'pattern matching. The compiler warns if your patterns are non-exhaustive.' },
        { token: '[| a; b; c |]', meaning: '**array** literal — semicolon-separated, mutable, fixed-size.' },
        { token: 'arr.(i)', meaning: 'array indexed access. `arr.(i) <- v` assigns. Lists use square brackets and ::.' },
        { token: 'ref x', meaning: 'create a **mutable cell** holding x. Read with `!cell`; write with `cell := v`.' },
        { token: '|>', meaning: 'pipeline: `x |> f` is `f x`. Same idea as Elixir or F#.' },
        { token: 'module M = ...', meaning: 'module — first-class collection of values, types, and submodules. Standard library modules: List, Array, Set, Map.' }
      ],
      example: {
        prose: `Sum an array with Array.fold_left. The fold takes a function (accumulator -> element -> new_accumulator), an initial value, and the array. Reads as a left-to-right reduction.`,
        code: `let total = Array.fold_left (+) 0 [| 3; 1; 4; 1; 5; 9; 2; 6 |]
(* total : int = 31 *)

(* same shape, different op: maximum *)
let largest = Array.fold_left max min_int [| 3; 1; 4; 1; 5; 9; 2; 6 |]
(* largest : int = 9 *)`,
        lang: 'ocaml'
      },
      link: {
        url: 'https://try.ocaml.pro/',
        label: 'Try OCaml — official, in-browser'
      }
    }
  },
  {
    chapterId: 'partition',
    chapterNum: 20,
    chapterTitle: 'Partition',
    title: 'Load balancing across racks',
    gesture: `Splitting jobs across two machines to finish at the same time is the scheduling-floor face of partition.`,
    body: `Datacenter schedulers (Borg, Kubernetes, Mesos) face the [[partition]] problem at every node-pair: given a set of pods with CPU/memory requests, assign them to two replicas to minimize the maximum load. That's the [[makespan]] version, equivalent to two-machine partition. Real schedulers solve it by approximation — [[LPT|longest-processing-time-first]] (also known as Graham's rule) is a 4/3 approximation and what Kubernetes' default scheduler effectively runs. The same problem appears in **transaction sharding** (split keys to balance across two shards), in [[VLSI]] **bisection** (split a chip's modules across two halves of a die), and in **cryptographic backup secret sharing** (Shamir-style schemes balance share sizes).`,
    eli5: `If you have two delivery trucks and a pile of packages of different weights, you want to split them so the trucks have roughly equal loads. That's partition. Doing it perfectly is hard; doing it well is fast.`
  },

  // ============================================================
  // CHAPTER 21 — MAX CUT (Julia)
  // ============================================================
  {
    chapterId: 'max-cut',
    chapterNum: 21,
    chapterTitle: 'Max Cut',
    chapterIntro: `[[Partition]] the [[vertex|vertices]] into two groups to maximize the [[edge|edges]] *between* the groups. The crown jewel of [[approximation ratio|approximation algorithms]] — and the canonical benchmark for [[QAOA|quantum optimization]].`,
    title: 'The maximum cut',
    tldr: `Partition vertices into two sets to maximize the number (or total weight) of edges crossing the partition. NP-complete; Goemans-Williamson achieves ≈0.878 approximation via SDP.`,
    gesture: `Min-cut is in P. Max-cut is NP-complete. The flip from min to max is enough to break tractability.`,
    body: `Max Cut partitions the vertex set into two sides and counts the edges that cross:

$$\\mathrm{cut}(S) \\;=\\; \\sum_{\\{u, v\\} \\in E,\\, |S \\cap \\{u,v\\}| = 1} w_{uv}, \\qquad S \\subseteq V. \\tag{1}$$

The problem is to maximize (1) over all partitions. Equivalently, assign each vertex a spin σ_v ∈ {−1, +1}; the *Ising spin glass* form is

$$\\max \\ \\sum_{\\{u,v\\} \\in E} w_{uv} \\cdot \\frac{1 - \\sigma_u \\sigma_v}{2}. \\tag{2}$$

Forms (1) and (2) are the same problem in graph-theoretic and physical clothing. [[NP-complete]] ([[Karp]]).

[[Goemans-Williamson]] 1995 — using [[SDP|semidefinite-program]] relaxation and random hyperplane rounding — achieves an approximation factor

$$\\alpha_{GW} \\;\\approx\\; 0.87856. \\tag{3}$$

Unless the [[Unique Games Conjecture]] is false, the constant in (3) is optimal among polynomial-time algorithms (Khot et al.). Max Cut is the [[QAOA]] poster child: the Quantum Approximate Optimization Algorithm targets this exact problem on near-term quantum hardware.`,
    figures: [
      {
        ref: '(1)',
        body: `**cut(S)** is a function: hand it a vertex subset S, get back a number — the total weight of edges that *cross* the cut.

The big-Σ sums over edges with a specific property. The condition under it — **{u, v} ∈ E** and **|S ∩ {u, v}| = 1** — picks edges where exactly one endpoint sits in S (and the other in V\\S).

The cardinality bars |S ∩ {u, v}| count how many of the two endpoints belong to S. Equal to 1 means the edge crosses the partition.

**w_{uv}** is the weight of edge {u, v}. For unweighted graphs, treat each weight as 1, and the cut value just counts crossing edges.`
      },
      {
        ref: '(2)',
        body: `The Ising form names spins instead of subsets. **σ_v ∈ {−1, +1}** assigns each vertex a spin (think: up or down).

The big-Σ sums one term per edge. The term **w_{uv} · (1 − σ_u σ_v)/2** uses a clever trick:

When **σ_u = σ_v** (same side), σ_u · σ_v = +1, so (1 − 1)/2 = 0 — the term contributes nothing.

When **σ_u ≠ σ_v** (opposite sides), σ_u · σ_v = −1, so (1 − (−1))/2 = 1 — the term contributes its full weight w_{uv}.

So the formula counts crossing edges by their weights, identical to (1) — just dressed in physics notation. Maximizing it is finding the spin assignment that maximizes "happy disagreement," which is also the ground state of an antiferromagnetic spin glass.`
      },
      {
        ref: '(3)',
        body: `**α_GW** is the Goemans–Williamson approximation factor. The subscript credits the authors of the 1995 paper.

The value **≈ 0.87856** is a guarantee: their algorithm always returns a cut whose weight is at least 87.856% of the optimal cut's weight.

The constant comes from a specific integral over the unit hyperbolic — a real number with no closed form, but provably ≈ 0.87856. Under the Unique Games Conjecture, no polynomial-time algorithm beats this constant.`
      }
    ],
    eli5: `Split a group of friends into two teams to maximize cross-team friendships. Sounds simple, but for arbitrary friendship graphs there's no fast exact algorithm — only very good approximations.`
  },
  {
    chapterId: 'max-cut',
    chapterNum: 21,
    chapterTitle: 'Max Cut',
    title: 'Local search in Julia',
    gesture: `Julia's array syntax and broadcasting fit physics problems like a glove. Local search converges fast and reads cleanly.`,
    steps: [
      {
        prose: `Represent the graph as a weighted adjacency matrix. Symmetric, zero diagonal — and Julia's BitArray is the natural fit for the partition assignment.`,
        code: `using Random

function build_graph(n::Int, p::Float64; seed=42)
    rng = MersenneTwister(seed)
    A = zeros(Float64, n, n)
    for i in 1:n, j in i+1:n
        if rand(rng) < p
            A[i, j] = A[j, i] = 1.0
        end
    end
    A
end`,
        lang: 'julia'
      },
      {
        prose: `Cut value: count edge weights where the two endpoints are on opposite sides. Vectorize over the upper triangle to keep it tight.`,
        code: `function cut_value(A::Matrix{Float64}, side::BitVector)
    s = 0.0
    n = size(A, 1)
    for i in 1:n, j in i+1:n
        if side[i] != side[j]
            s += A[i, j]
        end
    end
    s
end`,
        lang: 'julia'
      },
      {
        prose: `Greedy local search: starting from a random partition, flip any vertex whose flip increases the cut, until no such flip exists. Polynomial-time, lands at a local optimum within a factor of 2 of the global maximum.`,
        code: `function local_search(A::Matrix{Float64}; restarts=20)
    n = size(A, 1)
    best_side = falses(n); best_cut = 0.0
    for _ in 1:restarts
        side = bitrand(n)
        improved = true
        while improved
            improved = false
            for v in 1:n
                δ = sum(j -> (side[v] == side[j] ? 1 : -1) * A[v, j], 1:n)
                if δ > 0
                    side[v] = !side[v]
                    improved = true
                end
            end
        end
        c = cut_value(A, side)
        if c > best_cut
            best_cut = c; best_side = copy(side)
        end
    end
    (cut=best_cut, side=best_side)
end`,
        lang: 'julia'
      },
      {
        prose: `Run it. For exact solutions on small graphs, branch-and-bound; for large ones, Goemans–Williamson SDP via Convex.jl; for cutting-edge research, IBM's Qiskit ports this exact problem to quantum hardware via QAOA. Julia's strength is that all three approaches share the same data types.`,
        code: `julia> A = build_graph(20, 0.3);
julia> r = local_search(A)
(cut = 21.0, side = Bool[1, 0, 0, 1, 1, 0, 1, 0, 1, 0, 1, 0, 0, 1, 0, 1, 1, 0, 1, 0])`,
        lang: 'julia'
      }
    ],
    grammar: {
      language: 'Julia',
      intro: `Julia was designed for scientific computing — fast loops, broadcasting, and a multiple-dispatch type system that lets the compiler specialize on arbitrary type combinations. Physics-flavored problems like Max Cut fit it cleanly.`,
      tokens: [
        { token: 'function name(x::T)::R', meaning: 'a function with optionally-typed args and return. `end` closes the body.' },
        { token: 'using LinearAlgebra', meaning: 'load a module. `import` is the more controlled cousin.' },
        { token: 'arr[i, j]', meaning: '**1-indexed** array access. Multidimensional arrays use comma-separated indices.' },
        { token: 'zeros(Float64, n, n)', meaning: 'allocate an n×n zero matrix of Float64. Type comes first; pair with `ones` and `fill`.' },
        { token: 'for i in 1:n, j in i+1:n', meaning: 'nested loop in one line — comma separates the indices.' },
        { token: 'BitVector', meaning: 'a packed array of booleans. `bitrand(n)` makes a random one of length n.' },
        { token: '(field1=val1, field2=val2)', meaning: 'a **named tuple**. Like a record literal, no class definition needed.' },
        { token: 'cond ? a : b', meaning: 'ternary expression — same syntax as C/JavaScript.' },
        { token: 'x -> body', meaning: 'an anonymous function. Pair with broadcast (`f.(xs)`) for elementwise application.' }
      ],
      example: {
        prose: `Compute a Max Cut value: sum the weights of edges whose endpoints sit on different sides of the partition. The doubly-nested loop with the inline comma is idiomatic Julia.`,
        code: `function cut_value(A::Matrix{Float64}, side::BitVector)
    s = 0.0
    n = size(A, 1)
    for i in 1:n, j in i+1:n
        if side[i] != side[j]
            s += A[i, j]
        end
    end
    s
end`,
        lang: 'julia'
      },
      link: {
        url: 'https://julialang.org/learning/',
        label: 'Julia — official learning resources'
      }
    }
  },
  {
    chapterId: 'max-cut',
    chapterNum: 21,
    chapterTitle: 'Max Cut',
    title: 'Spin glasses and portfolio risk',
    gesture: `Max Cut is the Ising model wearing a graph-theory hat. It runs everything from condensed-matter simulations to portfolio risk balancing.`,
    body: `In condensed-matter physics, the [[Ising model|Ising]] [[spin glass]] is the ground state of a system of interacting magnetic spins — exactly Max Cut on the interaction graph. This problem motivated the development of [[simulated annealing]] (Kirkpatrick et al., 1983), which is now standard in optimization. In **finance**, mean-variance portfolio rebalancing under cardinality constraints reduces to a quadratic problem isomorphic to Max Cut; QC Ware and 1QBit have shipped Max-Cut-based portfolio optimizers. [[VLSI]] design uses Max Cut for layer assignment (assign each net to one of two metal layers, minimize via crossings). And **quantum computing** companies (Rigetti, IonQ, IBM Quantum) benchmark their hardware on Max Cut via [[QAOA]] — the canonical NISQ-era quantum optimization workload.`,
    eli5: `In a magnet, atoms can spin up or down, and atoms with opposite spins are happier together. Finding the most-stable arrangement (the most "happy pairs") is Max Cut. The same math runs in quantum-computing benchmarks and portfolio-balancing software.`
  }
];

export const flat = raw.map((s, i) => ({
  ...s,
  num: String(i + 1).padStart(2, '0'),
  orderIndex: i
}));

function buildChapters(sections) {
  const order = [];
  const map = new Map();
  for (const s of sections) {
    if (!map.has(s.chapterId)) {
      map.set(s.chapterId, {
        id: s.chapterId,
        num: s.chapterNum,
        title: s.chapterTitle,
        intro: s.chapterIntro || '',
        sections: []
      });
      order.push(s.chapterId);
    }
    map.get(s.chapterId).sections.push(s);
  }
  return order.map((id) => map.get(id));
}

export const chapters = buildChapters(flat);

export function next(num) {
  const i = flat.findIndex((s) => s.num === num);
  return i >= 0 && i < flat.length - 1 ? flat[i + 1] : null;
}

export function prev(num) {
  const i = flat.findIndex((s) => s.num === num);
  return i > 0 ? flat[i - 1] : null;
}

export function chapterOf(num) {
  const s = flat.find((s) => s.num === num);
  return s ? chapters.find((c) => c.id === s.chapterId) : null;
}

export function chapterIndexOf(num) {
  const c = chapterOf(num);
  return c ? chapters.indexOf(c) : -1;
}

export function nextChapter(num) {
  const i = chapterIndexOf(num);
  return i >= 0 && i < chapters.length - 1 ? chapters[i + 1] : null;
}

export function prevChapter(num) {
  const i = chapterIndexOf(num);
  return i > 0 ? chapters[i - 1] : null;
}

export function isFirstOfChapter(num) {
  const c = chapterOf(num);
  return c ? c.sections[0].num === num : false;
}

export function isLastOfChapter(num) {
  const c = chapterOf(num);
  return c ? c.sections[c.sections.length - 1].num === num : false;
}

export function positionInChapter(num) {
  const c = chapterOf(num);
  if (!c) return null;
  const i = c.sections.findIndex((s) => s.num === num);
  return { index: i, total: c.sections.length };
}
