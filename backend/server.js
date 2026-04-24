const express = require("express");
const app = express();

app.use(express.json());

// Function to validate input like A->B
const isValidEdge = (edge) => {
  const pattern = /^[A-Z]->[A-Z]$/;
  if (!pattern.test(edge)) return false;

  const [parent, child] = edge.split("->");
  if (parent === child) return false;

  return true;
};

app.post("/bfhl", (req, res) => {
  const inputData = req.body.data || [];

  let invalidEntries = [];
  let duplicateEdges = [];
  let uniqueEdges = new Set();

  let graph = {};
  let childNodes = new Set();

  // Step 1: Validate + remove duplicates
  inputData.forEach((item) => {
    let edge = item.trim();

    if (!isValidEdge(edge)) {
      invalidEntries.push(item);
      return;
    }

    if (uniqueEdges.has(edge)) {
      if (!duplicateEdges.includes(edge)) {
        duplicateEdges.push(edge);
      }
      return;
    }

    uniqueEdges.add(edge);

    const [parent, child] = edge.split("->");

    if (!graph[parent]) graph[parent] = [];
    graph[parent].push(child);

    childNodes.add(child);
  });

  // Step 2: Find root nodes
  const roots = Object.keys(graph).filter(
    (node) => !childNodes.has(node)
  );

  // Step 3: Build tree
  const buildTree = (node, visited = new Set()) => {
    if (visited.has(node)) {
      return { cycle: true };
    }

    visited.add(node);

    const children = graph[node] || [];
    let subtree = {};

    for (let child of children) {
      const result = buildTree(child, new Set(visited));

      if (result.cycle) return { cycle: true };

      subtree[child] = result;
    }

    return subtree;
  };

  // Step 4: Calculate depth
  const calculateDepth = (node) => {
    if (!graph[node] || graph[node].length === 0) return 1;

    let depths = graph[node].map((child) =>
      calculateDepth(child)
    );

    return 1 + Math.max(...depths);
  };

  let hierarchies = [];
  let totalTrees = 0;
  let totalCycles = 0;
  let maxDepth = 0;
  let largestTreeRoot = "";

  // Step 5: Process each root
  roots.forEach((root) => {
    const treeResult = buildTree(root);

    if (treeResult.cycle) {
      totalCycles++;
      hierarchies.push({
        root: root,
        tree: {},
        has_cycle: true,
      });
    } else {
      const depth = calculateDepth(root);
      totalTrees++;

      if (
        depth > maxDepth ||
        (depth === maxDepth && root < largestTreeRoot)
      ) {
        maxDepth = depth;
        largestTreeRoot = root;
      }

      hierarchies.push({
        root: root,
        tree: { [root]: treeResult },
        depth: depth,
      });
    }
  });

  res.json({
    user_id: "diyamnair_15062005",
    email_id: "dm3516@srmist.edu.in",
    college_roll_number: "RA2311003010430",
    hierarchies: hierarchies,
    invalid_entries: invalidEntries,
    duplicate_edges: duplicateEdges,
    summary: {
      total_trees: totalTrees,
      total_cycles: totalCycles,
      largest_tree_root: largestTreeRoot,
    },
  });
});

// ✅ REQUIRED for Render deployment
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});