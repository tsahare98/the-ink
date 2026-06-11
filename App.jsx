import { useState, useContext, createContext, useReducer, useEffect } from "react";

// ─── CONTEXTS ─────────────────────────────────────────────────────────────────
const AuthCtx = createContext(null);
const BlogCtx = createContext(null);

// ─── SEED DATA ────────────────────────────────────────────────────────────────
const SEED_USERS = [
  { id: 1, name: "Aryan Mehta", username: "aryan", email: "aryan@blog.dev", password: "aryan123", avatar: "AM", bio: "Full-stack dev. Coffee enthusiast.", joined: "Jan 2025" },
  { id: 2, name: "Priya Sharma", username: "priya", email: "priya@blog.dev", password: "priya123", avatar: "PS", bio: "UX designer & blogger.", joined: "Feb 2025" },
  { id: 3, name: "Tanmay K.", username: "tanmay", email: "tanmay@blog.dev", password: "tanmay123", avatar: "TK", bio: "Java student. Building things.", joined: "Apr 2025" },
];

const SEED_POSTS = [
  {
    id: 1, authorId: 1,
    title: "Mastering Java Multithreading in 2025",
    excerpt: "Concurrency bugs keep developers up at night. Here's how to sleep soundly.",
    content: `Multithreading is one of Java's most powerful — and most misunderstood — features. Whether you're building a web server that handles thousands of requests or a desktop app that needs a responsive UI, understanding threads is non-negotiable.

**Why Threads Matter**
A thread is a lightweight unit of execution within a process. Java's JVM can run multiple threads simultaneously (on multi-core CPUs), letting you parallelize CPU-bound work and keep I/O from blocking your whole application.

**The Core Primitives**
Start with \`Thread\`, \`Runnable\`, and \`Callable\`. Then graduate to the \`ExecutorService\` framework — it manages thread pools so you don't spin up unbounded threads and crash your heap.

\`\`\`java
ExecutorService pool = Executors.newFixedThreadPool(4);
Future<Integer> result = pool.submit(() -> heavyComputation());
System.out.println(result.get()); // blocks until done
\`\`\`

**Synchronization & Locks**
Race conditions happen when two threads read-modify-write shared state without coordination. Use \`synchronized\`, \`ReentrantLock\`, or \`java.util.concurrent\` atomics to guard critical sections.

**Common Pitfalls**
Deadlock, livelock, starvation — know them by name. Use thread dumps and tools like VisualVM to diagnose production issues before they escalate.`,
    tags: ["Java", "Concurrency", "Backend"],
    readTime: 6, likes: 42, views: 1204,
    createdAt: "2026-05-18T10:30:00Z",
    updatedAt: "2026-05-18T10:30:00Z",
  },
  {
    id: 2, authorId: 2,
    title: "Design Systems: Why Your Team Needs One Yesterday",
    excerpt: "Inconsistent UIs are a silent killer of developer velocity and user trust.",
    content: `Every fast-growing product hits the same wall: the codebase has six different button styles, three shades of 'primary blue', and no one remembers which one is canonical. Welcome to design system debt.

**What Is a Design System?**
It's a shared language between design and engineering — a collection of reusable components, tokens, patterns, and documentation that lets teams build consistent UIs at speed.

**Tokens First**
Start with design tokens: named values for colors, spacing, typography, shadows. When your primary color changes, you update one token, not 200 CSS files.

**Component Architecture**
Build atomic components (Button, Input, Badge) before composites (Card, Modal, Form). Each component should be self-contained, accessible, and documented with usage examples.

**Adoption Is the Hard Part**
The best design system nobody uses is worse than no design system. Invest in docs, Storybook, and internal evangelism. Make it easier to use than to roll your own.`,
    tags: ["Design", "UX", "Frontend"],
    readTime: 5, likes: 31, views: 890,
    createdAt: "2026-05-21T14:00:00Z",
    updatedAt: "2026-05-21T14:00:00Z",
  },
  {
    id: 3, authorId: 3,
    title: "RESTful API Design: Mistakes I Made So You Don't Have To",
    excerpt: "Six months of building APIs taught me patterns and anti-patterns the hard way.",
    content: `When I built my first REST API for a college project, I thought I was doing everything right. Six months and three refactors later, I realized I had made almost every classic mistake.

**Mistake 1: Treating URLs as Verbs**
\`/getUser\`, \`/deletePost\`, \`/updateProfile\` — these are RPC-style routes masquerading as REST. URLs should be nouns (resources). Use HTTP methods for the verbs: GET /users, DELETE /posts/:id, PATCH /profile.

**Mistake 2: Ignoring Status Codes**
Returning \`200 OK\` with \`{"error": "not found"}\` in the body is lying to the client. 404 means not found. 422 means validation failed. 401 vs 403 is the difference between "who are you" and "you can't do that." Use them correctly.

**Mistake 3: No Versioning from Day One**
\`/api/v1/\` costs you nothing to add upfront. Retrofitting it after clients are live is a painful negotiation.

**Mistake 4: Fat Responses**
Returning the entire database row for every query wastes bandwidth and leaks internal structure. Use DTOs. Let clients request only the fields they need (think sparse fieldsets or GraphQL if you go far enough).

**What I'd Do Differently**
Design the API contract first, in OpenAPI/Swagger. Treat it as a product with a public surface. Your future self — and your frontend teammates — will thank you.`,
    tags: ["API", "Backend", "REST"],
    readTime: 7, likes: 58, views: 2103,
    createdAt: "2026-05-25T09:00:00Z",
    updatedAt: "2026-05-25T09:00:00Z",
  },
];

const SEED_COMMENTS = [
  { id: 1, postId: 1, authorId: 2, content: "Great breakdown! The ExecutorService section finally clicked for me after reading this.", likes: 8, createdAt: "2026-05-19T08:20:00Z" },
  { id: 2, postId: 1, authorId: 3, content: "This is exactly what I needed for my Java exam prep. Bookmarked!", likes: 15, createdAt: "2026-05-19T11:45:00Z" },
  { id: 3, postId: 1, authorId: 1, content: "Thanks for the kind words! Happy to help. Let me know if you'd like a follow-up on CompletableFuture.", likes: 6, createdAt: "2026-05-20T09:00:00Z" },
  { id: 4, postId: 2, authorId: 1, content: "The tokens-first approach is underrated. We adopted it six months ago and our velocity doubled.", likes: 11, createdAt: "2026-05-22T10:30:00Z" },
  { id: 5, postId: 3, authorId: 2, content: "The status code point is so real. I've seen so many 200 errors in the wild 😅", likes: 19, createdAt: "2026-05-26T07:00:00Z" },
  { id: 6, postId: 3, authorId: 1, content: "Solid write-up. Worth adding: pagination from day one is another one people skip and regret.", likes: 7, createdAt: "2026-05-26T12:00:00Z" },
];

// ─── HELPERS ─────────────────────────────────────────────────────────────────
const fmtDate = iso => new Date(iso).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
const fmtTime = iso => new Date(iso).toLocaleString("en-IN", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" });
const AVATAR_COLORS = ["#e07b54","#54a0e0","#54e08a","#e054a0","#a054e0","#e0c354"];
const avatarColor = id => AVATAR_COLORS[id % AVATAR_COLORS.length];

// ─── BLOG REDUCER ─────────────────────────────────────────────────────────────
function blogReducer(state, action) {
  switch(action.type) {
    case "ADD_POST": return { ...state, posts: [action.post, ...state.posts] };
    case "UPDATE_POST": return { ...state, posts: state.posts.map(p => p.id === action.post.id ? action.post : p) };
    case "DELETE_POST": return { ...state, posts: state.posts.filter(p => p.id !== action.id), comments: state.comments.filter(c => c.postId !== action.id) };
    case "LIKE_POST": return { ...state, posts: state.posts.map(p => p.id === action.id ? { ...p, likes: p.likes + (action.liked ? -1 : 1) } : p) };
    case "ADD_COMMENT": return { ...state, comments: [...state.comments, action.comment] };
    case "DELETE_COMMENT": return { ...state, comments: state.comments.filter(c => c.id !== action.id) };
    case "LIKE_COMMENT": return { ...state, comments: state.comments.map(c => c.id === action.id ? { ...c, likes: c.likes + (action.liked ? -1 : 1) } : c) };
    case "ADD_USER": return { ...state, users: [...state.users, action.user] };
    default: return state;
  }
}

// ─── MAIN APP ─────────────────────────────────────────────────────────────────
export default function App() {
  const [state, dispatch] = useReducer(blogReducer, {
    posts: SEED_POSTS,
    comments: SEED_COMMENTS,
    users: SEED_USERS,
  });
  const [user, setUser] = useState(null);
  const [page, setPage] = useState("home"); // home | post | write | profile | login | register
  const [activePage, setActivePage] = useState("home");
  const [selectedPost, setSelectedPost] = useState(null);
  const [editPost, setEditPost] = useState(null);
  const [likedPosts, setLikedPosts] = useState(new Set());
  const [likedComments, setLikedComments] = useState(new Set());
  const [deleteModal, setDeleteModal] = useState(null); // postId

  const navigate = (p, data) => {
    setPage(p);
    if (p === "home" || p === "login" || p === "register" || p === "write" || p === "profile") setActivePage(p);
    if (data?.post) setSelectedPost(data.post);
    if (data?.edit) setEditPost(data.edit);
    window.scrollTo(0, 0);
  };

  const login = (email, password) => {
    const u = state.users.find(u => u.email === email && u.password === password);
    if (u) { setUser(u); return true; }
    return false;
  };
  const logout = () => { setUser(null); navigate("home"); };

  const register = ({ name, username, email, password, bio }) => {
    if (state.users.find(u => u.email === email)) return false;
    const newUser = { id: Date.now(), name, username, email, password, bio: bio || "", avatar: (name[0] + (name.split(" ")[1]?.[0] || name[1] || "")).toUpperCase(), joined: new Date().toLocaleDateString("en-IN", { month: "short", year: "numeric" }) };
    dispatch({ type: "ADD_USER", user: newUser });
    setUser(newUser);
    return true;
  };

  const togglePostLike = (postId) => {
    if (!user) return navigate("login");
    const liked = likedPosts.has(postId);
    dispatch({ type: "LIKE_POST", id: postId, liked });
    setLikedPosts(prev => { const s = new Set(prev); liked ? s.delete(postId) : s.add(postId); return s; });
  };

  const toggleCommentLike = (commentId) => {
    if (!user) return navigate("login");
    const liked = likedComments.has(commentId);
    dispatch({ type: "LIKE_COMMENT", id: commentId, liked });
    setLikedComments(prev => { const s = new Set(prev); liked ? s.delete(commentId) : s.add(commentId); return s; });
  };

  const addComment = (postId, content) => {
    dispatch({ type: "ADD_COMMENT", comment: { id: Date.now(), postId, authorId: user.id, content, likes: 0, createdAt: new Date().toISOString() } });
  };

  const deletePost = (id) => {
    dispatch({ type: "DELETE_POST", id });
    setDeleteModal(null);
    navigate("home");
  };

  const authorOf = id => state.users.find(u => u.id === id) || { name: "Unknown", avatar: "?", id: 0 };

  return (
    <AuthCtx.Provider value={{ user, login, logout, register }}>
      <BlogCtx.Provider value={{ state, dispatch, authorOf, navigate, likedPosts, likedComments, togglePostLike, toggleCommentLike, addComment }}>
        <div className="app">
          <Nav user={user} page={activePage} navigate={navigate} logout={logout} />
          {page === "home" && <HomePage navigate={navigate} user={user} onDeleteClick={setDeleteModal} />}
          {page === "post" && selectedPost && <PostPage post={state.posts.find(p => p.id === selectedPost.id) || selectedPost} navigate={navigate} user={user} onDeleteClick={setDeleteModal} />}
          {page === "write" && user && <WritePage existing={editPost} navigate={navigate} user={user} dispatch={dispatch} onDone={() => { setEditPost(null); navigate("home"); }} />}
          {page === "profile" && <ProfilePage navigate={navigate} user={user} />}
          {page === "login" && <LoginPage navigate={navigate} />}
          {page === "register" && <RegisterPage navigate={navigate} />}
        </div>
        {deleteModal && (
          <div className="modal-overlay" onClick={e => e.target === e.currentTarget && setDeleteModal(null)}>
            <div className="modal">
              <div className="modal-title">Delete this post?</div>
              <p style={{ color: "var(--muted)", fontSize: "0.9rem" }}>This action cannot be undone. All comments will also be removed.</p>
              <div className="modal-actions">
                <button className="btn btn-ghost btn-sm" onClick={() => setDeleteModal(null)}>Cancel</button>
                <button className="btn btn-sm" style={{ background: "#c04040", color: "#fff" }} onClick={() => deletePost(deleteModal)}>Delete Post</button>
              </div>
            </div>
          </div>
        )}
      </BlogCtx.Provider>
    </AuthCtx.Provider>
  );
}

// ─── NAV ─────────────────────────────────────────────────────────────────────
function Nav({ user, page, navigate, logout }) {
  return (
    <nav className="nav">
      <div className="brand" onClick={() => navigate("home")}>
        The<em>Ink</em>
      </div>
      <div className="nav-right">
        <button className={`nav-link ${page === "home" ? "active" : ""}`} onClick={() => navigate("home")}>Explore</button>
        {user && <button className={`nav-link ${page === "profile" ? "active" : ""}`} onClick={() => navigate("profile")}>My Blog</button>}
        <div className="nav-divider" />
        {user ? (<>
          <div className="user-pill">
            <AvatarBadge u={user} size="sm" /> {user.name.split(" ")[0]}
          </div>
          <button className="nav-btn" onClick={() => navigate("write", { edit: null })}>+ Write</button>
          <button className="nav-link" onClick={logout}>Sign Out</button>
        </>) : (<>
          <button className="nav-link" onClick={() => navigate("login")}>Sign In</button>
          <button className="nav-btn" onClick={() => navigate("register")}>Join Free</button>
        </>)}
      </div>
    </nav>
  );
}

function AvatarBadge({ u, size }) {
  const cls = size === "lg" ? "avatar lg" : size === "xl" ? "avatar xl" : "avatar";
  return <div className={cls} style={{ background: avatarColor(u.id) }}>{u.avatar}</div>;
}

// ─── HOME ────────────────────────────────────────────────────────────────────
function HomePage({ navigate, user, onDeleteClick }) {
  const { state, authorOf } = useContext(BlogCtx);
  const [search, setSearch] = useState("");
  const [activeTag, setActiveTag] = useState("All");

  const allTags = ["All", ...new Set(state.posts.flatMap(p => p.tags))];
  const filtered = state.posts.filter(p =>
    (activeTag === "All" || p.tags.includes(activeTag)) &&
    (p.title.toLowerCase().includes(search.toLowerCase()) || p.excerpt.toLowerCase().includes(search.toLowerCase()))
  );
  const topPosts = [...state.posts].sort((a, b) => b.views - a.views).slice(0, 3);
  const topAuthors = state.users.map(u => ({ ...u, count: state.posts.filter(p => p.authorId === u.id).length })).filter(u => u.count > 0);

  return (
    <>
      <div className="hero">
        <div className="hero-label">Est. 2026 · Developer Community</div>
        <h1 className="hero-title">Where developers<br/>write & read</h1>
        <p className="hero-sub">Deep dives, opinions, and tutorials from the people building the future.</p>
      </div>
      <div className="main">
        <div className="two-col">
          <div>
            <div className="filters">
              <input className="search-bar" placeholder="Search posts…" value={search} onChange={e => setSearch(e.target.value)} />
              {allTags.map(t => <button key={t} className={`tag-chip ${activeTag === t ? "on" : ""}`} onClick={() => setActiveTag(t)}>{t}</button>)}
            </div>
            {filtered.length === 0
              ? <div className="empty"><div className="empty-icon">✍️</div><div className="empty-title">No posts found</div><p>Try a different tag or search term.</p></div>
              : filtered.map(post => {
                const author = authorOf(post.authorId);
                const commentCount = state.comments.filter(c => c.postId === post.id).length;
                return (
                  <div key={post.id} className="post-card" onClick={() => navigate("post", { post })}>
                    <div className="post-meta">
                      <AvatarBadge u={author} size="sm" />
                      <span className="post-author-name">{author.name}</span>
                      <span className="dot">·</span>
                      <span className="post-date">{fmtDate(post.createdAt)}</span>
                      <span className="dot">·</span>
                      <span className="post-date">{post.readTime} min read</span>
                    </div>
                    <div className="post-title">{post.title}</div>
                    <div className="post-excerpt">{post.excerpt}</div>
                    <div className="post-footer">
                      <div className="tags">{post.tags.map(t => <span key={t} className="tag">{t}</span>)}</div>
                      <div className="post-stats">
                        <span className="stat">♥ {post.likes}</span>
                        <span className="stat">💬 {commentCount}</span>
                        <span className="stat">👁 {post.views}</span>
                        {user && post.authorId === user.id && (
                          <span className="stat" onClick={e => { e.stopPropagation(); onDeleteClick(post.id); }} style={{ color: "#c04040", cursor: "pointer" }}>🗑</span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>
          <div>
            <div className="sidebar-section">
              <div className="sidebar-title">Trending Posts</div>
              {topPosts.map((p, i) => (
                <div key={p.id} className="trending-item" onClick={() => navigate("post", { post: p })}>
                  <div className="trending-num">{String(i + 1).padStart(2, "0")}</div>
                  <div className="trending-title">{p.title}</div>
                  <div className="trending-meta" style={{ clear: "both" }}>{authorOf(p.authorId).name} · {p.views} views</div>
                </div>
              ))}
            </div>
            <div className="sidebar-section">
              <div className="sidebar-title">Active Writers</div>
              {topAuthors.map(u => (
                <div key={u.id} className="author-mini">
                  <AvatarBadge u={u} size="sm" />
                  <div className="author-mini-info">
                    <div className="author-mini-name">{u.name}</div>
                    <div className="author-mini-post">{u.count} post{u.count !== 1 ? "s" : ""}</div>
                  </div>
                </div>
              ))}
            </div>
            {!user && (
              <div className="sidebar-section" style={{ textAlign: "center" }}>
                <div className="sidebar-title">Join TheInk</div>
                <p style={{ fontSize: "0.85rem", color: "var(--muted)", marginBottom: "1rem" }}>Share your ideas with a community of developers and readers.</p>
                <button className="btn btn-rust btn-full btn-sm" onClick={() => navigate("register")}>Start Writing Free</button>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

// ─── POST DETAIL ──────────────────────────────────────────────────────────────
function PostPage({ post, navigate, user, onDeleteClick }) {
  const { state, authorOf, likedPosts, likedComments, togglePostLike, toggleCommentLike, addComment, dispatch } = useContext(BlogCtx);
  const [comment, setComment] = useState("");
  const author = authorOf(post.authorId);
  const comments = state.comments.filter(c => c.postId === post.id);

  function renderContent(text) {
    if (!text) return null;
    const lines = text.split("\n");
    const elements = [];
    let inCodeBlock = false;
    let codeLines = [];
    let codeLang = "";

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];

      // Code Block Detection
      if (line.startsWith("```")) {
        if (inCodeBlock) {
          // End of code block
          const codeString = codeLines.join("\n");
          elements.push(
            <pre key={`code-${i}`} style={{ position: 'relative' }}>
              {codeLang && <span style={{ position: 'absolute', right: '12px', top: '8px', fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', fontFamily: 'sans-serif', fontWeight: 'bold' }}>{codeLang}</span>}
              <code>{codeString}</code>
            </pre>
          );
          inCodeBlock = false;
          codeLines = [];
          codeLang = "";
        } else {
          // Start of code block
          inCodeBlock = true;
          codeLang = line.slice(3).trim();
        }
        continue;
      }

      if (inCodeBlock) {
        codeLines.push(line);
        continue;
      }

      // Headers (e.g., **Heading**)
      if (line.trim().startsWith("**") && line.trim().endsWith("**")) {
        const headerText = line.trim().slice(2, -2);
        elements.push(
          <h3 key={`h-${i}`} style={{ fontFamily: "'Playfair Display',serif", margin: "1.5rem 0 0.5rem", fontSize: "1.25rem", color: "var(--ink)", fontWeight: "700" }}>
            {headerText}
          </h3>
        );
        continue;
      }

      // Empty line
      if (line.trim() === "") {
        elements.push(<br key={`br-${i}`} />);
        continue;
      }

      // Normal paragraph
      const processed = line
        .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
        .replace(/`(.*?)`/g, "<code>$1</code>");
      elements.push(
        <p key={`p-${i}`} dangerouslySetInnerHTML={{ __html: processed }} />
      );
    }

    // Unclosed code block recovery
    if (inCodeBlock && codeLines.length > 0) {
      elements.push(
        <pre key="code-unclosed">
          <code>{codeLines.join("\n")}</code>
        </pre>
      );
    }

    return elements;
  }

  const handleSubmitComment = () => {
    if (!comment.trim() || !user) return;
    addComment(post.id, comment.trim());
    setComment("");
  };

  return (
    <div className="main" style={{ maxWidth: 900 }}>
      <button className="back-btn" onClick={() => navigate("home")}>← Back to Explore</button>
      <div className="post-hero">
        <div className="post-hero-label">{post.tags.join(" · ")}</div>
        <h1 className="post-hero-title">{post.title}</h1>
        <div className="post-hero-meta">
          <AvatarBadge u={author} size="sm" />
          <span className="post-hero-author">{author.name}</span>
          <span className="dot" style={{ color: "rgba(255,255,255,0.3)" }}>·</span>
          <span className="post-hero-stat">📅 {fmtDate(post.createdAt)}</span>
          <span className="post-hero-stat">⏱ {post.readTime} min</span>
          <span className="post-hero-stat">👁 {post.views}</span>
        </div>
      </div>

      <div className="article-body">{renderContent(post.content)}</div>

      <div className="action-bar">
        <button className={`action-btn ${likedPosts.has(post.id) ? "liked" : ""}`} onClick={() => togglePostLike(post.id)}>
          ♥ {post.likes} {likedPosts.has(post.id) ? "Liked" : "Like"}
        </button>
        <span style={{ fontSize: "0.83rem", color: "var(--muted)" }}>💬 {comments.length} comments</span>
        {user && post.authorId === user.id && (<>
          <button className="action-btn edit" onClick={() => navigate("write", { edit: post })}>✏ Edit</button>
          <button className="action-btn del" onClick={() => onDeleteClick(post.id)}>🗑 Delete</button>
        </>)}
      </div>

      <div className="comments-section">
        <div className="comments-title">Comments ({comments.length})</div>
        {user ? (
          <div className="comment-form">
            <div style={{ display: "flex", gap: 10, marginBottom: 10 }}>
              <AvatarBadge u={user} size="sm" />
              <span style={{ fontSize: "0.88rem", fontWeight: 700, alignSelf: "center" }}>{user.name}</span>
            </div>
            <textarea className="comment-textarea" placeholder="Share your thoughts…" value={comment} onChange={e => setComment(e.target.value)} />
            <div className="comment-actions">
              <button className="btn btn-ghost btn-sm" onClick={() => setComment("")}>Clear</button>
              <button className="btn btn-rust btn-sm" onClick={handleSubmitComment} disabled={!comment.trim()}>Post Comment</button>
            </div>
          </div>
        ) : (
          <div style={{ background: "var(--cream)", border: "1px solid var(--border)", borderRadius: "var(--radius-md)", padding: "1.25rem", marginBottom: "1.5rem", textAlign: "center" }}>
            <span style={{ color: "var(--muted)", fontSize: "0.9rem" }}>
              <button style={{ background: "none", border: "none", color: "var(--rust)", fontWeight: 700, cursor: "pointer", fontFamily: "Lato,sans-serif" }} onClick={() => navigate("login")}>Sign in</button> to join the conversation.
            </span>
          </div>
        )}

        {comments.length === 0
          ? <div className="empty" style={{ padding: "2rem" }}><div className="empty-icon">💬</div><p>No comments yet. Be the first!</p></div>
          : comments.map(c => {
            const cAuthor = authorOf(c.authorId);
            return (
              <div key={c.id} className="comment-card">
                <AvatarBadge u={cAuthor} size="sm" />
                <div className="comment-body">
                  <div className="comment-header">
                    <span className="comment-name">{cAuthor.name}</span>
                    <span className="comment-time">{fmtTime(c.createdAt)}</span>
                  </div>
                  <div className="comment-text">{c.content}</div>
                  <div className="comment-footer">
                    <button className={`like-btn ${likedComments.has(c.id) ? "on" : ""}`} onClick={() => toggleCommentLike(c.id)}>
                      ♥ {c.likes}
                    </button>
                    {user && c.authorId === user.id && (
                      <button className="del-comment" onClick={() => dispatch({ type: "DELETE_COMMENT", id: c.id })}>Delete</button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
}

// ─── WRITE / EDIT ─────────────────────────────────────────────────────────────
function WritePage({ existing, navigate, user, dispatch, onDone }) {
  const [title, setTitle] = useState(existing?.title || "");
  const [excerpt, setExcerpt] = useState(existing?.excerpt || "");
  const [content, setContent] = useState(existing?.content || "");
  const [tags, setTags] = useState(existing?.tags || []);
  const [tagInput, setTagInput] = useState("");
  const [readTime, setReadTime] = useState(existing?.readTime || 5);
  const [error, setError] = useState("");

  const addTag = () => {
    const t = tagInput.trim();
    if (t && !tags.includes(t)) setTags([...tags, t]);
    setTagInput("");
  };

  const submit = () => {
    if (!title.trim() || !content.trim()) return setError("Title and content are required.");
    if (existing) {
      dispatch({ type: "UPDATE_POST", post: { ...existing, title, excerpt, content, tags, readTime: +readTime, updatedAt: new Date().toISOString() } });
    } else {
      dispatch({ type: "ADD_POST", post: { id: Date.now(), authorId: user.id, title, excerpt, content, tags, readTime: +readTime, likes: 0, views: Math.floor(Math.random() * 50), createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() } });
    }
    onDone();
  };

  return (
    <div className="main">
      <button className="back-btn" onClick={() => navigate("home")}>← Cancel</button>
      <div className="editor-card">
        <div className="editor-title">{existing ? "Edit Post" : "Write a New Post"}</div>
        {error && <div className="error" style={{ marginBottom: "1rem" }}>{error}</div>}
        <div className="form-group">
          <label className="form-label">Title *</label>
          <input className="form-input" value={title} onChange={e => setTitle(e.target.value)} placeholder="An unforgettable headline…" />
        </div>
        <div className="form-group">
          <label className="form-label">Excerpt</label>
          <input className="form-input" value={excerpt} onChange={e => setExcerpt(e.target.value)} placeholder="One-line teaser for readers…" />
        </div>
        <div className="form-group">
          <label className="form-label">Content * (Markdown-lite supported)</label>
          <textarea className="form-textarea" style={{ minHeight: 280 }} value={content} onChange={e => setContent(e.target.value)} placeholder={"Start writing...\n\nUse **bold** and `code` formatting.\nCode blocks: wrap with ```"} />
        </div>
        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Tags</label>
            <div className="tags-input-row">
              {tags.map(t => (
                <span key={t} className="tag-removable">{t} <button onClick={() => setTags(tags.filter(x => x !== t))}>×</button></span>
              ))}
              <input className="tag-add-input" value={tagInput} onChange={e => setTagInput(e.target.value)} onKeyDown={e => e.key === "Enter" && addTag()} placeholder="Add tag…" />
              {tagInput && <button className="btn btn-ghost btn-sm" onClick={addTag}>Add</button>}
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Read Time (mins)</label>
            <input className="form-input" type="number" min={1} max={60} value={readTime} onChange={e => setReadTime(e.target.value)} />
          </div>
        </div>
        <div className="editor-actions">
          <button className="btn btn-rust" onClick={submit}>{existing ? "Save Changes" : "Publish Post"}</button>
          <button className="btn btn-ghost" onClick={() => navigate("home")}>Cancel</button>
        </div>
      </div>
    </div>
  );
}

// ─── PROFILE ─────────────────────────────────────────────────────────────────
function ProfilePage({ navigate, user }) {
  const { state } = useContext(BlogCtx);
  if (!user) return <div className="page-center"><div style={{ textAlign: "center" }}><p style={{ color: "var(--muted)" }}>Please sign in to view your profile.</p><br /><button className="btn btn-rust btn-sm" onClick={() => navigate("login")}>Sign In</button></div></div>;
  const myPosts = state.posts.filter(p => p.authorId === user.id);
  const totalLikes = myPosts.reduce((s, p) => s + p.likes, 0);
  const totalViews = myPosts.reduce((s, p) => s + p.views, 0);

  return (
    <div className="main">
      <div className="profile-header">
        <AvatarBadge u={user} size="xl" />
        <div className="profile-info">
          <div className="profile-name">{user.name}</div>
          <div className="profile-bio">{user.bio || "No bio yet."}</div>
          <div className="profile-meta">
            <span className="profile-stat"><strong>{myPosts.length}</strong> Posts</span>
            <span className="profile-stat"><strong>{totalLikes}</strong> Likes</span>
            <span className="profile-stat"><strong>{totalViews}</strong> Views</span>
            <span className="profile-stat">Joined {user.joined}</span>
          </div>
        </div>
        <button className="btn btn-rust btn-sm" onClick={() => navigate("write")}>+ New Post</button>
      </div>
      <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: "1.3rem", marginBottom: "1rem" }}>Your Posts</h2>
      {myPosts.length === 0
        ? <div className="empty"><div className="empty-icon">✍️</div><div className="empty-title">Nothing published yet</div><p>Your first post is one click away.</p><br /><button className="btn btn-rust btn-sm" onClick={() => navigate("write")}>Write Something</button></div>
        : myPosts.map(post => (
          <div key={post.id} className="post-card" onClick={() => navigate("post", { post })}>
            <div className="post-title">{post.title}</div>
            <div className="post-excerpt">{post.excerpt}</div>
            <div className="post-footer">
              <div className="tags">{post.tags.map(t => <span key={t} className="tag">{t}</span>)}</div>
              <div className="post-stats">
                <span className="stat">♥ {post.likes}</span>
                <span className="stat">👁 {post.views}</span>
                <span className="stat">{fmtDate(post.createdAt)}</span>
              </div>
            </div>
          </div>
        ))}
    </div>
  );
}

// ─── LOGIN ────────────────────────────────────────────────────────────────────
function LoginPage({ navigate }) {
  const { login } = useContext(AuthCtx);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handle = () => {
    const ok = login(email, password);
    if (ok) navigate("home"); else setError("Incorrect email or password.");
  };

  const quick = (e, p) => { const ok = login(e, p); if (ok) navigate("home"); };

  return (
    <div className="page-center">
      <div className="auth-card">
        <div className="auth-title">Welcome back.</div>
        <div className="auth-sub">Sign in to read, write, and connect.</div>
        <div className="form-group">
          <label className="form-label">Email</label>
          <input className="form-input" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" />
        </div>
        <div className="form-group">
          <label className="form-label">Password</label>
          <input className="form-input" type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" onKeyDown={e => e.key === "Enter" && handle()} />
        </div>
        {error && <div className="error">{error}</div>}
        <button className="btn btn-primary btn-full" style={{ marginTop: "1.25rem" }} onClick={handle}>Sign In</button>
        <div className="quick-logins">
          <div className="quick-label">Quick Demo Login</div>
          <div className="quick-row">
            {SEED_USERS.map(u => <button key={u.id} className="quick-btn" onClick={() => quick(u.email, u.password)}>{u.name.split(" ")[0]}</button>)}
          </div>
        </div>
        <div className="auth-switch">New here? <button onClick={() => navigate("register")}>Create an account →</button></div>
      </div>
    </div>
  );
}

// ─── REGISTER ────────────────────────────────────────────────────────────────
function RegisterPage({ navigate }) {
  const { register } = useContext(AuthCtx);
  const [form, setForm] = useState({ name: "", username: "", email: "", password: "", bio: "" });
  const [error, setError] = useState("");

  const handle = () => {
    if (!form.name || !form.email || !form.password) return setError("Name, email, and password are required.");
    const ok = register(form);
    if (ok) navigate("home"); else setError("Email already in use.");
  };

  const f = key => ({ value: form[key], onChange: e => setForm({ ...form, [key]: e.target.value }) });

  return (
    <div className="page-center">
      <div className="auth-card">
        <div className="auth-title">Start writing.</div>
        <div className="auth-sub">Join TheInk and share your ideas with the world.</div>
        {["name", "username", "email"].map(k => (
          <div className="form-group" key={k}>
            <label className="form-label">{k.charAt(0).toUpperCase() + k.slice(1)}</label>
            <input className="form-input" {...f(k)} placeholder={k === "email" ? "you@example.com" : k === "username" ? "@handle" : "Full name"} />
          </div>
        ))}
        <div className="form-group">
          <label className="form-label">Password</label>
          <input className="form-input" type="password" {...f("password")} placeholder="Choose a strong password" />
        </div>
        <div className="form-group">
          <label className="form-label">Bio (optional)</label>
          <input className="form-input" {...f("bio")} placeholder="A sentence about yourself…" />
        </div>
        {error && <div className="error">{error}</div>}
        <button className="btn btn-rust btn-full" style={{ marginTop: "1.25rem" }} onClick={handle}>Create Account</button>
        <div className="auth-switch">Already have an account? <button onClick={() => navigate("login")}>Sign in →</button></div>
      </div>
    </div>
  );
}
