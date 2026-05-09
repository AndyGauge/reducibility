// Glossary for Reducibility.
//
// Each entry:
//   body:    short definition (markdown — bold/em supported, no figures)
//   aliases: optional list of synonyms; [[alias]] links to the canonical anchor
//   see:     optional list of related canonical terms shown as "see also"
//
// Adding a term: pick the canonical name (the one a textbook would index),
// write a 1-3 sentence definition, list the synonyms readers might write.

export const glossary = {
  // ============ Complexity classes & meta ============

  'P': {
    body: `The class of decision problems solvable in **polynomial time** by a deterministic algorithm. "Easy," in complexity-theory shorthand. Linear, quadratic, or any nᵏ-time algorithm puts a problem in P.`,
    aliases: ['class P']
  },

  'NP': {
    body: `The class of decision problems whose "yes" answers can be **verified** in polynomial time given a proof. The N stands for *nondeterministic*: a nondeterministic Turing machine could guess the proof and verify in polynomial time. Whether NP = P is the most famous open problem in computer science.`,
    aliases: ['nondeterministic polynomial time', 'class NP']
  },

  'NP-complete': {
    body: `The hardest problems in NP: every NP problem reduces to them in polynomial time. If any one NP-complete problem had a polynomial-time algorithm, all of NP would collapse to P. Karp's 21 problems are the foundational examples.`,
    aliases: ['NP complete']
  },

  'NP-hard': {
    body: `**At least as hard** as the hardest problems in NP. NP-complete problems are NP-hard *and* in NP; an NP-hard problem need not be in NP itself (it might be even harder).`,
    aliases: ['NP hard']
  },

  'polynomial time': {
    body: `An algorithm runs in polynomial time if its runtime is bounded by some polynomial in the input size — O(n), O(n²), O(n³ log n), etc. Polynomial-time algorithms are considered tractable; exponential-time ones are not.`,
    aliases: ['polynomial-time']
  },

  'pseudo-polynomial': {
    body: `An algorithm whose runtime is polynomial in the *numeric values* of the input, not the bit-length. Knapsack's O(n·W) DP is pseudo-polynomial: doubling the bits of W doubles the input length but squares the runtime.`,
    aliases: ['pseudopolynomial']
  },

  'reduction': {
    body: `A polynomial-time algorithm that converts instances of problem A into instances of problem B such that A's answer is recoverable from B's. The standard tool for proving NP-completeness: reduce a known NP-complete problem to your new one.`,
    aliases: ['polynomial-time reduction', 'Karp reduction']
  },

  'decision problem': {
    body: `A problem whose answer is yes or no. "Is there a clique of size 5?" is a decision problem; "what is the largest clique?" is the corresponding optimization problem. Complexity classes (P, NP, etc.) are defined over decision problems.`
  },

  'approximation ratio': {
    body: `For an optimization problem, the worst-case ratio between an algorithm's output and the true optimum. A 2-approximation guarantees you'll always be within 2× of optimal. The PCP theorem and other tools give *inapproximability* results: lower bounds on what any polynomial algorithm can achieve.`,
    aliases: ['approximation factor']
  },

  'FPTAS': {
    body: `**Fully Polynomial-Time Approximation Scheme** — an algorithm achieving a (1−ε) approximation in time polynomial in both n and 1/ε. Knapsack admits one. Most NP-hard problems do not.`
  },

  'fixed-parameter tractable': {
    body: `A problem is **FPT** in a parameter k if it can be solved in time f(k) · n^O(1) — exponential in k allowed, but polynomial in the input size n. Vertex cover is FPT in the answer size; general SAT is not FPT in any natural parameter.`,
    aliases: ['FPT', 'fixed parameter tractable']
  },

  'big-O notation': {
    body: `An upper bound on growth rate. f(n) = O(g(n)) means there exist constants C, n₀ such that f(n) ≤ C·g(n) for all n ≥ n₀. Used to describe algorithm runtimes without committing to constant factors.`,
    aliases: ['big-O', 'big O']
  },

  // ============ Boolean / SAT terms ============

  'SAT': {
    body: `**Boolean satisfiability**. Given a Boolean formula, decide whether some assignment of true/false to the variables makes it evaluate to true. Cook (1971) proved SAT NP-complete; Karp (1972) used it as the seed for twenty more reductions. The "mother problem" of NP-completeness.`,
    aliases: ['satisfiability', 'Boolean satisfiability']
  },

  '3-SAT': {
    body: `SAT restricted so every clause has at most three literals. Still NP-complete. Most modern reductions go through 3-SAT rather than general SAT — the fixed clause width makes gadget construction easier.`,
    aliases: ['3SAT', 'three-SAT']
  },

  '2-SAT': {
    body: `SAT restricted to two literals per clause. Solvable in **linear time** via the implication graph's strongly-connected components. The boundary between 2-SAT and 3-SAT is one of complexity theory's sharpest cliffs.`,
    aliases: ['2SAT', 'two-SAT']
  },

  'CNF': {
    body: `**Conjunctive normal form** — a Boolean formula written as a conjunction (AND) of clauses, where each clause is a disjunction (OR) of literals. Every Boolean formula has an equivalent CNF form, possibly exponentially larger.`,
    aliases: ['conjunctive normal form']
  },

  'clause': {
    body: `In a CNF formula, a single OR-group of literals. The whole formula is the AND of all its clauses. To satisfy the formula, every clause must have at least one true literal.`
  },

  'literal': {
    body: `A variable or its negation. In CNF, every clause is a disjunction of literals. The "size" of a clause is the count of literals in it.`
  },

  '0/1 assignment': {
    body: `An assignment of 0 (false) or 1 (true) to each variable. The yes/no decision per variable, with no fractions allowed. Also called a **Boolean assignment** or **truth assignment**.`,
    aliases: ['Boolean assignment', '0-1 assignment', 'truth assignment']
  },

  'DPLL': {
    body: `**Davis–Putnam–Logemann–Loveland** algorithm — the textbook complete SAT solver. A backtracking search that picks a variable, tries it true, recurses; on failure tries false. Modern CDCL solvers descend from DPLL.`
  },

  'CDCL': {
    body: `**Conflict-Driven Clause Learning** — the SAT-solving paradigm behind every modern industrial solver (MiniSat, Glucose, CaDiCaL, Kissat). When the search hits a conflict, it analyzes the cause and adds a "learned clause" that prunes the search space.`
  },

  'WalkSAT': {
    body: `A randomized **local-search** SAT algorithm. Start with a random assignment; repeatedly pick an unsatisfied clause and flip a variable in it. Incomplete (can't prove UNSAT), but very fast on satisfiable random instances.`
  },

  'SAT solver': {
    body: `A program that decides satisfiability of CNF formulas. Modern industrial solvers handle millions of variables; they are the inner engines of hardware verification, model checking, and many constraint-programming systems.`
  },

  'backtracking': {
    body: `A search strategy that tries a choice, recurses, and on failure reverses ("backs up") to try a different choice. Most NP-complete-problem solvers are some form of backtracking, often with smart pruning.`
  },

  // ============ Graph theory ============

  'graph': {
    body: `A pair G = (V, E): a vertex set V and an edge set E. Edges are unordered pairs (undirected graph) or ordered pairs (directed graph). The basic combinatorial structure underlying about half of Karp's 21.`
  },

  'vertex': {
    body: `One of the dots in a graph. Also called a **node**. The set V in G = (V, E).`,
    aliases: ['node']
  },

  'edge': {
    body: `One of the lines in a graph — a connection between two vertices. The set E in G = (V, E). Edges may have weights (a number per edge) and directions.`
  },

  'directed graph': {
    body: `A graph whose edges are ordered pairs — each edge points *from* one vertex *to* another. Cycles, paths, and Hamilton circuits all have directed and undirected variants.`,
    aliases: ['digraph']
  },

  'undirected graph': {
    body: `A graph whose edges are unordered pairs — each edge simply connects two vertices, with no direction. Vertex cover, clique, and chromatic number all live on undirected graphs.`
  },

  'DAG': {
    body: `**Directed Acyclic Graph** — a directed graph with no cycles. Equivalent to "you can lay the vertices on a line such that every edge points forward." Build systems, dependency graphs, and topological-sort applications all live here.`,
    aliases: ['directed acyclic graph']
  },

  'cycle': {
    body: `A path in a graph that starts and ends at the same vertex without repeating any other vertex. Detection is linear-time; finding cycles with extra structure (like Hamilton) can be NP-hard.`
  },

  'clique': {
    body: `A subset of a graph's vertices, every pair of which is joined by an edge. Maximum clique is NP-hard; on a perfect graph it's polynomial.`
  },

  'independent set': {
    body: `A subset of a graph's vertices, no two of which are joined by an edge. The complement (in the graph-theoretic sense) of a clique: an independent set in G is a clique in the complement graph.`
  },

  'complement graph': {
    body: `For a graph G, the graph with the same vertex set but with edge set inverted: every edge of G becomes a non-edge, and vice versa. Cliques in G are independent sets in the complement.`
  },

  'subgraph': {
    body: `A graph obtained from another by deleting some vertices and edges. An **induced subgraph** is one where you delete vertices and keep all edges between the survivors.`
  },

  'induced subgraph': {
    body: `The subgraph G[S] of G obtained by keeping only the vertices in S and all edges between them. Different from a general subgraph, where you can also delete edges between kept vertices.`
  },

  'spanning tree': {
    body: `A tree (connected, acyclic subgraph) that includes every vertex of the original graph. The **minimum spanning tree (MST)** picks the spanning tree of least total edge weight.`
  },

  'minimum spanning tree': {
    body: `A spanning tree of minimum total edge weight. Solvable in O(E log V) by Kruskal's or Prim's algorithm. A natural baseline for the harder Steiner tree problem.`,
    aliases: ['MST']
  },

  'Hamilton circuit': {
    body: `A cycle in a graph that visits every vertex exactly once and returns to the start. Detection is NP-complete on both directed and undirected graphs. Same shape as the traveling salesman problem (which adds edge weights and asks for the shortest such cycle).`,
    aliases: ['Hamiltonian circuit', 'Hamilton cycle', 'Hamiltonian cycle']
  },

  'Eulerian circuit': {
    body: `A cycle that traverses every *edge* exactly once. Easy: a graph has one iff every vertex has equal in-degree and out-degree (directed) or even degree (undirected). The "every edge" version of the Hamilton problem, but polynomial time.`,
    aliases: ['Euler circuit', 'Eulerian cycle']
  },

  'chromatic number': {
    body: `The minimum number of colors needed to properly color a graph — that is, to assign colors to vertices such that no edge connects two same-colored vertices. Written χ(G). Computing it is NP-hard.`,
    aliases: ['χ(G)']
  },

  // ============ Set / combinatorial ============

  'universe': {
    body: `In set-cover, set-packing, and exact-cover problems, the ground set U whose elements must be covered or packed. Distinct from the family F of subsets which serve as the choices.`
  },

  'partition': {
    body: `A division of a set into disjoint, non-empty subsets that together cover the original. Also: the NP-complete problem of splitting a multiset of integers into two equal-sum subsets.`
  },

  // ============ Algorithms named in the book ============

  'Bron-Kerbosch': {
    body: `The classical recursive algorithm for enumerating maximal cliques in an undirected graph. With Tomita's pivot rule, it is roughly the best practical exact algorithm for clique enumeration.`,
    aliases: ['Bron–Kerbosch']
  },

  'Algorithm X': {
    body: `Donald Knuth's recursive backtracker for exact cover, paired with the **Dancing Links (DLX)** data structure that makes the cover/uncover operations fast. The reference solver for Sudoku and polyomino tiling.`,
    aliases: ['Dancing Links', 'DLX']
  },

  'Goemans-Williamson': {
    body: `The 1995 algorithm achieving a 0.87856-approximation for Max Cut, using semidefinite-program relaxation and random hyperplane rounding. Under the Unique Games Conjecture, this constant is optimal among polynomial-time algorithms.`,
    aliases: ['Goemans–Williamson']
  },

  'Karmarkar-Karp': {
    body: `A heuristic for the partition and number-balancing problems. Repeatedly replaces the two largest numbers with their absolute difference, until one number remains. Achieves astonishingly tight approximations on random inputs.`,
    aliases: ['Karmarkar–Karp', 'differencing heuristic']
  },

  // ============ People ============

  'Cook': {
    body: `**Stephen Cook** (1939–2024). His 1971 paper "The Complexity of Theorem-Proving Procedures" introduced NP-completeness and proved SAT NP-complete. The Cook–Levin theorem is named jointly with Leonid Levin, who proved an equivalent result independently.`,
    aliases: ['Stephen Cook']
  },

  'Karp': {
    body: `**Richard Karp** (b. 1935). His 1972 paper "Reducibility Among Combinatorial Problems" took Cook's NP-completeness of SAT and propagated it through 21 problems via reduction. The book you're reading is built around that paper.`,
    aliases: ['Richard Karp']
  },

  'Cook-Levin theorem': {
    body: `The theorem (Cook 1971, Levin 1973 independently) that SAT is NP-complete. Founding result of complexity theory.`,
    aliases: ['Cook–Levin']
  },

  // ============ Programming ============

  'linear programming': {
    body: `Optimization of a linear objective subject to linear inequality constraints, with continuous variables. Solvable in polynomial time (Khachiyan 1979). Drop the continuity and you get integer programming, which is NP-hard.`,
    aliases: ['LP']
  },

  'integer programming': {
    body: `Linear programming with the variables restricted to integers. NP-hard in general; the 0-1 case (variables restricted to {0, 1}) is one of Karp's 21.`,
    aliases: ['IP', 'integer linear programming', 'ILP']
  },

  'mixed-integer programming': {
    body: `Linear programming where some variables must be integers and others may be continuous. The workhorse formulation behind industrial optimization solvers (Gurobi, CPLEX, COIN-OR).`,
    aliases: ['MIP', 'MILP']
  },

  // ============ Hardware / EDA (chapter 1 business) ============

  'HDL': {
    body: `**Hardware Description Language** — a programming language for describing the structure and behavior of digital circuits. Verilog and VHDL are the two industrial standards; SystemVerilog extends Verilog with verification features.`,
    aliases: ['hardware description language']
  },

  'RTL': {
    body: `**Register-Transfer Level** — a level of abstraction where a circuit is described as data flow between registers and the logic operations between them. Synthesizable HDL is written at this level; synthesis tools turn it into a gate-level netlist.`,
    aliases: ['register-transfer level', 'register transfer level']
  },

  'gate-level netlist': {
    body: `A description of a circuit as a network of basic logic gates (AND, OR, NOT, flip-flops, latches). The output of synthesis from RTL, and the input to placement and routing. Equivalence checking compares it against the RTL spec.`,
    aliases: ['netlist']
  },

  'equivalence checking': {
    body: `Formal verification that two circuit descriptions — typically an RTL spec and a gate-level netlist — compute the same function on every input. Encoded as a SAT instance: "does there exist an input on which they disagree?" An UNSAT answer means they're equivalent.`
  },

  'mask set': {
    body: `The set of photomasks used to print a chip in a semiconductor fab. Costs scale with process node sophistication — typical nodes run $5–30M, leading-edge nodes (3nm, 2nm) reach nine figures. A logic bug after mask creation means re-doing them.`
  },

  'tape out': {
    body: `Submitting a finished chip design to the fab for manufacturing. Historically delivered on magnetic tape, hence the name. Post-tape-out bugs require a *respin* — millions of dollars and months of delay — which is why exhaustive pre-tape-out verification matters.`,
    aliases: ['tape-out', 'tapeout']
  },

  'EDA': {
    body: `**Electronic Design Automation** — software for designing electronic systems, especially integrated circuits. Cadence, Synopsys, and Siemens EDA dominate the industry; their tools cover synthesis, simulation, formal verification, and place-and-route.`,
    aliases: ['Electronic Design Automation']
  },

  'UNSAT': {
    body: `The result when a SAT instance has **no** satisfying assignment — every possible variable assignment fails at least one clause. Equivalence checkers *want* UNSAT: it proves "no input makes the spec and the netlist disagree."`,
    aliases: ['unsatisfiable']
  },

  'MiniSat': {
    body: `The 2003 SAT solver by Eén and Sörensson that established the modern CDCL algorithm template. Most commercial and academic solvers since — Glucose, CaDiCaL, Kissat — descend directly from it. Open-source, ~600 lines of core C++.`
  },

  'Pentium FDIV bug': {
    body: `A 1994 floating-point division flaw in Intel's Pentium processor, caused by five missing entries in a lookup table. The recall cost ~$475M in 1994 dollars (about $1.05B in 2026 USD) and is the textbook example of why hardware verification — and the SAT-solving infrastructure that supports it — matters.`,
    aliases: ['Pentium FDIV', 'FDIV bug']
  },

  // ============ Optimization & operations research ============

  'NPV': {
    body: `**Net Present Value** — the value today of a future stream of cash flows, discounted by a chosen interest rate. The standard metric in capital budgeting; positive NPV means a project is worth funding.`,
    aliases: ['net present value']
  },

  'crew pairing': {
    body: `In airline scheduling, a sequence of flight legs one crew can fly together, starting and ending at base, satisfying duty-time and rest rules. Choosing the cheapest valid combination of pairings to cover all legs is a set partitioning problem.`,
    aliases: ['pairing']
  },

  'set partitioning': {
    body: `An integer programming variant of [[exact cover|exact-cover]]: pick a subfamily so each universe element is covered by **exactly** one chosen set, minimizing total cost. The standard formulation for airline crew assignment, vehicle routing, and shift scheduling.`,
    aliases: ['set partitioning problem']
  },

  'column generation': {
    body: `An LP technique for problems with too many variables to enumerate. Solve with a small subset of variables (columns); a *pricing* subproblem proposes new columns that could improve the solution; iterate until none can. Standard for crew pairing and routing.`
  },

  '2-approximation': {
    body: `An approximation algorithm that always returns an answer within a factor of 2 of optimal — never more than twice as bad. Vertex cover and Steiner tree both admit simple 2-approximations.`,
    aliases: ['2-approx']
  },

  // ============ Graphs in industry ============

  'AML': {
    body: `**Anti-Money-Laundering** — banking compliance work to detect, prevent, and report layering and structuring of illicit funds. Modern AML systems search transaction graphs for suspicious dense subgraphs and cycles.`,
    aliases: ['anti-money-laundering']
  },

  'transaction graph': {
    body: `A directed graph where vertices are accounts and edges represent money transfers within a time window. The substrate for fraud detection, AML, and credit-network analysis.`
  },

  'deadlock': {
    body: `A state where two or more processes are each waiting on resources held by the others, so none can proceed. Detected by finding cycles in the wait-for graph; broken by aborting a *victim* — feedback vertex set choosing which.`
  },

  'wait-for graph': {
    body: `A directed graph used by database engines and OS schedulers: a vertex per process/transaction, an edge T1→T2 if T1 is blocked waiting on a resource T2 holds. A cycle is a deadlock.`
  },

  'rank aggregation': {
    body: `Combining multiple rankings (judges, voters, search engines, reviewers) into a single consensus ranking. The Kemeny optimal aggregation is equivalent to minimum feedback arc set on a tournament graph.`
  },

  'register allocation': {
    body: `Compiler step that maps program variables onto a small set of CPU registers. Variables whose lifetimes overlap must use different registers — modeled as graph coloring on the *interference graph*. Chaitin's 1981 paper introduced this framing.`
  },

  'interference graph': {
    body: `In compiler register allocation, the graph with a vertex per program variable and an edge between variables whose lifetimes overlap. Coloring it with k colors corresponds to assigning the variables to k registers.`
  },

  'community detection': {
    body: `Partitioning the vertices of a network into densely-connected groups. Louvain and Leiden algorithms are the most-deployed heuristics; they optimize *modularity* rather than exact clique cover.`
  },

  'modularity': {
    body: `A measure of how well a network partition separates densely-connected groups from each other. Higher modularity = clearer community structure. Louvain and Leiden are greedy modularity maximizers.`
  },

  'Louvain algorithm': {
    body: `A fast greedy algorithm for community detection by modularity maximization. Each iteration moves vertices to neighboring communities to improve modularity, then aggregates communities into super-nodes and repeats.`
  },

  // ============ Algorithms named in business pages ============

  'traveling salesman problem': {
    body: `Given n cities and pairwise distances, find the shortest tour visiting every city exactly once and returning to start. NP-hard; equivalent to Hamilton circuit with edge weights and an objective. Concorde is the canonical academic solver.`,
    aliases: ['TSP']
  },

  'Lin-Kernighan': {
    body: `A 1973 local-search heuristic for TSP that swaps multiple edges per improvement step. Modern variants (LKH) routinely solve 100,000-city instances to within 0.1% of optimal.`,
    aliases: ['Lin–Kernighan', 'LKH']
  },

  'Hopcroft-Karp': {
    body: `An O(E·√V) algorithm for maximum matching in bipartite graphs. The polynomial-time complement to the NP-completeness of 3-dimensional matching.`,
    aliases: ['Hopcroft–Karp']
  },

  'DSATUR': {
    body: `**Degree of Saturation** — a 1979 graph-coloring heuristic by Daniel Brélaz. Colors vertices in order of saturation degree (number of distinct colors among already-colored neighbors), breaking ties by raw degree. Optimal on small graphs; very good on large ones.`
  },

  // ============ Software verification ============

  'model checking': {
    body: `Automated verification that a system model satisfies a logical specification. Modern model checkers (CBMC, SPIN, NuSMV) reduce the question to SAT or SMT.`
  },

  'bounded model checking': {
    body: `Model checking that unrolls program execution k steps and asks "does any execution of length ≤ k violate the property?" The unrolled question becomes a CNF formula and gets solved by a SAT solver.`,
    aliases: ['BMC']
  },

  'symbolic execution': {
    body: `Running a program with *symbolic* (un-fixed) inputs, accumulating constraints at each branch. At the end, a SAT/SMT solver decides which input concretizations reach which states. KLEE, Coverity, and CodeQL all use this technique.`
  },

  // ============ Networking & VLSI ============

  'VLSI': {
    body: `**Very-Large-Scale Integration** — the process of building integrated circuits with millions to billions of transistors. The original arena where graph coloring (register allocation), Steiner tree (wire routing), and Max Cut (layer assignment) all became industrial concerns.`,
    aliases: ['Very-Large-Scale Integration']
  },

  'multicast routing': {
    body: `Network routing where one source delivers to many receivers, sharing intermediate hops. The minimum-bandwidth multicast tree is a Steiner tree with the source and receivers as terminals and the routers as Steiner-point candidates.`,
    aliases: ['multicast']
  },

  // ============ Markets & finance ============

  'kidney exchange': {
    body: `Three-way (or longer) cyclic donor-patient swaps that match incompatible patient-donor pairs. Donor A → Patient B, Donor B → Patient C, Donor C → Patient A. Finding the maximum number of disjoint such cycles is a 3-dimensional matching variant.`
  },

  'CPM': {
    body: `**Cost Per Mille** — advertising price per thousand impressions ("mille" = thousand). The standard knapsack-style ad-serving objective: maximize revenue subject to the user's session-impression budget.`,
    aliases: ['cost per mille']
  },

  'tax-loss harvesting': {
    body: `Selling losing investments to realize capital losses (offset against gains for tax purposes), while replacing them with similar holdings to keep market exposure. Picking *which* lots to harvest under a tracking-error budget is a knapsack problem.`
  },

  // ============ Scheduling ============

  'EDF': {
    body: `**Earliest Deadline First** — a real-time scheduling algorithm that always runs the task with the soonest deadline. Optimal for single-processor preemptive scheduling: if any algorithm can meet all deadlines, EDF can.`,
    aliases: ['earliest deadline first']
  },

  'rate-monotonic scheduling': {
    body: `A real-time scheduling rule: tasks with shorter periods get higher priority. Liu and Layland (1973) proved it optimal among fixed-priority schedulers. Used heavily in safety-critical embedded systems.`,
    aliases: ['rate-monotonic']
  },

  'Ravenscar profile': {
    body: `A subset of Ada designed for safety-critical real-time systems. Restricts language features (no dynamic task creation, no general tasking primitives) so that schedulability and absence of deadlock can be proved statically.`
  },

  'makespan': {
    body: `In scheduling, the total time from the start of the first job to the completion of the last. Minimizing makespan across machines is the partition/load-balancing problem.`
  },

  'LPT': {
    body: `**Longest Processing Time** scheduling — Graham's 1969 rule: assign jobs in decreasing order of length to whichever machine currently has the lightest load. A 4/3-approximation for two-machine makespan.`,
    aliases: ['longest processing time']
  },

  // ============ Physics & quantum ============

  'Ising model': {
    body: `A statistical-physics model of magnetism: each lattice site has a spin in {−1, +1}, neighboring spins prefer to align (or disalign). The ground state of an antiferromagnetic Ising model on a graph is exactly Max Cut.`
  },

  'spin glass': {
    body: `An Ising model with random, mixed-sign couplings — some neighbors prefer alignment, others prefer disagreement. Finding the ground state is NP-hard and motivated the development of simulated annealing.`
  },

  'simulated annealing': {
    body: `A randomized optimization heuristic by Kirkpatrick et al. (1983), inspired by annealing in metallurgy. Accepts worse moves with probability decreasing in a "temperature" parameter, escaping local minima. The most-deployed general-purpose heuristic for hard combinatorial problems.`
  },

  'QAOA': {
    body: `**Quantum Approximate Optimization Algorithm** — a near-term quantum algorithm for combinatorial optimization, especially Max Cut. Alternates between a problem-encoding Hamiltonian and a mixing Hamiltonian; each layer adds parameters tuned by a classical outer loop.`,
    aliases: ['Quantum Approximate Optimization Algorithm']
  },

  'Unique Games Conjecture': {
    body: `A 2002 conjecture by Subhash Khot: a particular constraint-satisfaction problem (Unique Games) is NP-hard. If true, it implies that the Goemans–Williamson constant 0.87856 for Max Cut, and many other approximation ratios, are tight.`,
    aliases: ['UGC']
  },

  'SDP': {
    body: `**Semidefinite Programming** — optimization of a linear objective over the cone of positive-semidefinite matrices, subject to linear constraints. Generalizes LP; solvable in polynomial time. The relaxation underlying Goemans–Williamson Max Cut.`,
    aliases: ['semidefinite program', 'semidefinite programming']
  },

  // ============ Security & ops ============

  'SIEM': {
    body: `**Security Information and Event Management** — software for ingesting log/event data from across a network and correlating to detect attacks. Threat-indicator matching against the corpus is a hitting-set problem at scale.`,
    aliases: ['Security Information and Event Management']
  },

  'test minimization': {
    body: `Reducing a regression test suite to its smallest subset that still covers every requirement. A hitting-set problem: each requirement is a "set" of tests covering it; we pick the smallest set of tests hitting every requirement.`
  },

  // ============ Telecom & manufacturing ============

  'SONET': {
    body: `**Synchronous Optical Networking** — the dominant US/Canada standard for long-haul fiber-optic transmission since the 1990s. Typically deployed as self-healing **rings**, where a single fiber cut still leaves a working path. Building a SONET ring through chosen sites is a Hamilton-circuit problem on the eligible-fiber graph.`,
    aliases: ['Synchronous Optical Networking']
  },

  'OTN': {
    body: `**Optical Transport Network** — the post-2000 ITU successor to SONET/SDH, designed to carry both legacy synchronous traffic and modern packet data over the same fiber. Same ring topology, same Hamilton-circuit framing.`,
    aliases: ['Optical Transport Network']
  },

  'PCB': {
    body: `**Printed Circuit Board** — the green or beige substrate that holds and connects electronic components. Manufacturing requires drilling thousands of holes (vias) and routing copper traces; the order in which the drill bit visits the holes is a Hamilton-circuit / TSP problem on the via-coordinate graph.`,
    aliases: ['printed circuit board']
  },

  'via': {
    body: `A small drilled hole through a PCB or chip that lets a copper trace cross from one layer to another. A modern board has thousands; the drill head visiting them all in minimum-travel order is a TSP instance solved daily on every PCB factory floor.`,
    aliases: ['vias']
  },

  'BEAM': {
    body: `The virtual machine that runs Erlang and Elixir. Designed by Ericsson for telecom switches: lightweight processes (~300 bytes each), preemptive scheduling, hot code reload, and message-passing concurrency. Originally short for **B**ogdan/**B**jörn's **E**rlang **A**bstract **M**achine.`
  },

  'CNC milling': {
    body: `**Computer Numerical Control** milling — automated metal-cutting where the tool head follows a computer-generated path. Like PCB drilling, the order of separate cuts is a TSP-shaped problem; routing the head to minimize travel time directly cuts machine cost.`,
    aliases: ['CNC']
  },

  'wafer probing': {
    body: `Testing each die on a semiconductor wafer with a probe card before the wafer is diced. The probe head steps through thousands of dies — another TSP instance, with the added wrinkle that bad dies can be skipped to save time.`
  },

  // ============ Complexity-theory machinery ============

  'gadget construction': {
    body: `The standard technique for reducing one NP-complete problem to another. Encode instances of the source problem as small graph or formula "gadgets," each enforcing some local logical relationship; stitch the gadgets together so a solution to the target problem corresponds to a solution to the source. Most of Karp's original 21 reductions work this way.`,
    aliases: ['gadget']
  },

  'Lasserre hierarchy': {
    body: `A sequence of progressively-stronger semidefinite-programming relaxations for combinatorial optimization. The k-th level adds degree-2k polynomial constraints; as k grows, the relaxation gets tighter but the SDP grows too. Used in inapproximability proofs and in the Sum-of-Squares (SoS) algorithm framework.`,
    aliases: ['SoS hierarchy', 'Sum-of-Squares hierarchy']
  },

  // ============ Runtimes & compilers ============

  'JVM': {
    body: `**Java Virtual Machine** — the runtime that executes Java bytecode. The class-file *verifier* checks bytecode for type and stack safety on load (a kind of bounded model checking), then the JIT compiles hot methods to native machine code. Hosts Java, Kotlin, Clojure, Scala.`,
    aliases: ['Java Virtual Machine']
  },

  'JIT': {
    body: `**Just-In-Time** compilation — translating bytecode (or another portable representation) to native machine code at runtime, after profiling reveals which methods are hot. The JVM (HotSpot, GraalVM), V8, .NET CLR, and PyPy all do this.`,
    aliases: ['just-in-time', 'just-in-time compilation', 'JIT compilation']
  },

  'register': {
    body: `A CPU's small, fast on-chip storage location. Modern CPUs have ~16 general-purpose integer registers (more for floating point and SIMD). The compiler assigns program variables to registers via graph coloring on the interference graph; running out forces *spilling* to slower memory.`,
    aliases: ['registers', 'CPU register']
  },

  'interference': {
    body: `In compilers, two program variables **interfere** if their lifetimes overlap — both are alive at the same instruction, so they cannot share a register. Build a graph with a vertex per variable and an edge per interfering pair; coloring this graph with k colors corresponds to assigning the variables to k registers.`,
    aliases: ['interfere', 'variable interference']
  },

  // ============ Software verification (chapter 11 business) ============

  'null dereference': {
    body: `Reading or writing through a pointer or reference that is null. In Java this throws NullPointerException; in C/C++ it's undefined behavior, often a crash. "No execution ever null-dereferences" is a canonical property model checkers verify.`,
    aliases: ['null-dereferenced', 'null pointer dereference', 'null deref']
  },

  'lock': {
    body: `A concurrency primitive that grants one thread exclusive access to a shared resource at a time. A thread holding a lock blocks others trying to acquire it. A lock acquired but never released causes deadlock; "this lock is always released" is a property model checkers verify.`,
    aliases: ['mutex', 'locking']
  },

  'JBMC': {
    body: `**Java Bounded Model Checker** — Diffblue's open-source verifier that finds bugs in Java bytecode by unrolling and reducing properties to SAT. A descendant of CBMC.`
  },

  'SPIN': {
    body: `A 1989 model checker by Gerard Holzmann that takes a system described in the PROMELA language and verifies temporal-logic properties. Originally aimed at communication protocols; still in heavy use for protocol and distributed-algorithm verification.`
  },

  'CBMC': {
    body: `**C Bounded Model Checker** — the C/C++ counterpart to JBMC. Unrolls program loops, encodes the result as SAT or SMT, and finds counterexamples to user-supplied assertions. Microsoft's SLAM device-driver verifier was an early descendant.`
  },

  // ============ Steiner / VLSI / data terms ============

  'co-occurrence graph': {
    body: `A graph where vertices are items (words, products, features, genes) and an edge connects two items that appear together in the same sample, document, or basket. Cliques are sets of items that *always* appear together; finding them powers feature-merging and recommendation systems.`,
    aliases: ['cooccurrence graph']
  },

  'differential diagnosis': {
    body: `In medicine, the list of conditions that could plausibly explain a patient's symptoms. Picking the smallest panel of tests that distinguishes every condition on the differential is a hitting-set problem.`,
    aliases: ['differential']
  },

  'Steiner tree': {
    body: `Given a weighted graph and a subset of "terminal" vertices, the minimum-weight subtree that connects every terminal. Non-terminal vertices may be included as **Steiner points** — connectors that lower the total weight. NP-hard. Chapter 16 of this book.`
  },

  'subtree': {
    body: `A connected, acyclic subgraph of a graph — a tree carved out of a larger graph. The Steiner tree is a subtree of the input graph chosen to span the terminals.`
  },

  'terminal': {
    body: `In Steiner-tree problems, a vertex that **must** be included in the chosen subtree. Distinguished from non-terminal (Steiner) vertices, which the algorithm may include as connectors or skip entirely.`
  },

  'Steiner point': {
    body: `A non-terminal vertex selected to be part of a Steiner tree because routing through it shortens the total weight. The freedom to add Steiner points is what separates Steiner tree from minimum spanning tree (which is in P).`,
    aliases: ['Steiner points']
  },

  'router': {
    body: `In chip design, the EDA tool stage that lays out the metal wires connecting circuit pins, after placement has fixed pin locations. Routing is a sequence of Steiner-tree problems on a grid graph — one per net, with obstacles where existing wires sit.`,
    aliases: ['routing', 'place-and-route']
  },

  'net': {
    body: `In chip design, a set of pins that all carry the same electrical signal — they must be connected by wire. A modern chip has millions of nets; routing each one is a separate small Steiner-tree problem.`
  },

  'rectilinear': {
    body: `**Axis-aligned** — using only horizontal and vertical movement, with 90° turns. Chip wires are rectilinear because they follow metal layers on a Manhattan grid; *rectilinear Steiner tree* restricts the tree edges to such moves and is the form chip routers actually solve.`
  }
};

const slugify = (s) =>
  String(s).toLowerCase().trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

// Build alias→canonical lookup once.
function buildLookup() {
  const m = new Map();
  for (const [canonical, entry] of Object.entries(glossary)) {
    m.set(canonical.toLowerCase(), canonical);
    for (const a of entry.aliases || []) {
      m.set(a.toLowerCase(), canonical);
    }
  }
  return m;
}

export const lookup = buildLookup();
export { slugify };

// Sorted [canonical, entry] pairs for the glossary page.
export function entriesAlphabetical() {
  return Object.entries(glossary).sort(([a], [b]) =>
    a.toLowerCase().localeCompare(b.toLowerCase())
  );
}
