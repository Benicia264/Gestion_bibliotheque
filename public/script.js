const API_BASE = "/api"; 

// ---------- Navigation ----------
const navLinks = document.querySelectorAll(".nav-link");
const views = document.querySelectorAll(".view");

navLinks.forEach(link => {
  link.addEventListener("click", () => {
    navLinks.forEach(l => l.classList.remove("active"));
    views.forEach(v => v.classList.remove("active"));
    link.classList.add("active");
    document.getElementById(link.dataset.section).classList.add("active");

    if (link.dataset.section === "tableau-de-bord") chargerStatistiques();
    if (link.dataset.section === "auteurs") chargerAuteurs();
    if (link.dataset.section === "livres") chargerLivres();
    if (link.dataset.section === "adherents") chargerAdherents();
    if (link.dataset.section === "emprunts") chargerEmprunts();
  });
});

// ---------- Utilitaires ----------
async function appel(url, options = {}) {
  const res = await fetch(API_BASE + url, {
    headers: { "Content-Type": "application/json" },
    ...options
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || `Erreur ${res.status}`);
  return data;
}

function toast(message, isError = false) {
  const stack = document.getElementById("toast-stack");
  const el = document.createElement("div");
  el.className = "toast" + (isError ? " err" : "");
  el.textContent = message;
  stack.appendChild(el);
  setTimeout(() => el.remove(), 3500);
}

function formaterDate(dateStr) {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString("fr-FR");
}

// ---------- Statut API ----------
async function verifierApi() {
  const dot = document.getElementById("clock-status");
  const label = document.getElementById("api-status-label");
  try {
    await appel("/statistiques");
    dot.classList.add("ok");
    label.textContent = "API connectée";
  } catch {
    dot.classList.add("err");
    label.textContent = "API injoignable";
  }
}

// ---------- Tableau de bord ----------
async function chargerStatistiques() {
  try {
    const s = await appel("/statistiques");
    document.getElementById("stat-livres").textContent = s.totalLivres ?? "—";
    document.getElementById("stat-adherents").textContent = s.totalAdherents ?? "—";
    document.getElementById("stat-en-cours").textContent = s.empruntsEnCours ?? "—";
    document.getElementById("stat-retard").textContent = s.empruntsEnRetard ?? "—";
    document.getElementById("stat-top-livre").textContent = s.livrePlusEmprunte?.titre ?? "Aucun emprunt pour l'instant";
    document.getElementById("stat-top-adherent").textContent = s.adherentPlusActif?.nom ?? "Aucun emprunt pour l'instant";
  } catch (e) {
    toast("Impossible de charger les statistiques", true);
  }
}

// ---------- Auteurs ----------
let auteursCache = [];

async function rafraichirCacheAuteurs() {
  try {
    auteursCache = await appel("/auteurs");
  } catch { auteursCache = []; }
}

async function chargerAuteurs() {
  const tbody = document.getElementById("auteurs-tbody");
  tbody.innerHTML = `<tr><td colspan="3" class="empty-row">Chargement…</td></tr>`;
  try {
    await rafraichirCacheAuteurs();
    if (!auteursCache.length) {
      tbody.innerHTML = `<tr><td colspan="3" class="empty-row">Aucun auteur enregistré.</td></tr>`;
      return;
    }
    tbody.innerHTML = auteursCache.map(a => `
      <tr>
        <td>${a.nom}</td>
        <td>${a.nationalite ?? "—"}</td>
        <td class="row-actions">
          <button class="btn btn-ghost btn-sm" onclick="ouvrirModifAuteur(${a.id})">Modifier</button>
          <button class="btn btn-danger btn-sm" onclick="supprimerAuteur(${a.id})">Supprimer</button>
        </td>
      </tr>
    `).join("");
  } catch (e) {
    tbody.innerHTML = `<tr><td colspan="3" class="empty-row">Erreur de chargement.</td></tr>`;
  }
}

async function supprimerAuteur(id) {
  if (!confirm("Supprimer cet auteur ? Les livres associés pourraient être affectés.")) return;
  try {
    await appel(`/auteurs/${id}`, { method: "DELETE" });
    toast("Auteur supprimé");
    chargerAuteurs();
  } catch (e) {
    toast(e.message, true);
  }
}

function ouvrirNouvelAuteur() {
  ouvrirModale("Ajouter un auteur", `
    <div class="field">
      <label for="f-nom">Nom</label>
      <input id="f-nom" required>
    </div>
    <div class="field">
      <label for="f-nationalite">Nationalité</label>
      <input id="f-nationalite" required>
    </div>
    <p class="field-error" id="form-error"></p>
    <div class="modal-actions">
      <button type="button" class="btn btn-ghost" id="modal-annuler">Annuler</button>
      <button type="submit" class="btn btn-primary">Ajouter</button>
    </div>
  `, async () => {
    const nom = document.getElementById("f-nom").value.trim();
    const nationalite = document.getElementById("f-nationalite").value.trim();
    if (!nom || !nationalite) { afficherErreurForm("Nom et nationalité sont obligatoires."); return; }
    try {
      await appel("/auteurs", { method: "POST", body: JSON.stringify({ nom, nationalite }) });
      toast("Auteur ajouté");
      fermerModale();
      chargerAuteurs();
    } catch (e) {
      afficherErreurForm(e.message);
    }
  });
}

async function ouvrirModifAuteur(id) {
  const auteur = auteursCache.find(a => a.id === id);
  if (!auteur) return;
  ouvrirModale("Modifier l'auteur", `
    <div class="field">
      <label for="f-nom">Nom</label>
      <input id="f-nom" required value="${auteur.nom}">
    </div>
    <div class="field">
      <label for="f-nationalite">Nationalité</label>
      <input id="f-nationalite" required value="${auteur.nationalite ?? ''}">
    </div>
    <p class="field-error" id="form-error"></p>
    <div class="modal-actions">
      <button type="button" class="btn btn-ghost" id="modal-annuler">Annuler</button>
      <button type="submit" class="btn btn-primary">Enregistrer</button>
    </div>
  `, async () => {
    const nom = document.getElementById("f-nom").value.trim();
    const nationalite = document.getElementById("f-nationalite").value.trim();
    try {
      await appel(`/auteurs/${id}`, { method: "PUT", body: JSON.stringify({ nom, nationalite }) });
      toast("Auteur modifié");
      fermerModale();
      chargerAuteurs();
    } catch (e) {
      afficherErreurForm(e.message);
    }
  });
}

document.getElementById("btn-nouvel-auteur").addEventListener("click", ouvrirNouvelAuteur);

// ---------- Livres ----------
let livresPage = 1;
let livresRecherche = "";

async function chargerLivres() {
  const tbody = document.getElementById("livres-tbody");
  tbody.innerHTML = `<tr><td colspan="5" class="empty-row">Chargement…</td></tr>`;
  try {
    const data = await appel(`/livres?recherche=${encodeURIComponent(livresRecherche)}&page=${livresPage}&limite=8`);
    if (!data.livres.length) {
      tbody.innerHTML = `<tr><td colspan="5" class="empty-row">Aucun livre trouvé.</td></tr>`;
    } else {
      tbody.innerHTML = data.livres.map(l => `
        <tr>
          <td>${l.titre}</td>
          <td>${l.auteur_nom}</td>
          <td>${l.annee_publication}</td>
          <td><span class="badge badge--${l.statut === 'disponible' ? 'disponible' : 'emprunte'}">${l.statut}</span></td>
          <td class="row-actions">
            <button class="btn btn-ghost btn-sm" onclick="ouvrirModifLivre(${l.id})">Modifier</button>
            <button class="btn btn-danger btn-sm" onclick="supprimerLivre(${l.id})">Supprimer</button>
          </td>
        </tr>
      `).join("");
    }
    dessinerPagination(data.page, data.totalPages);
  } catch (e) {
    tbody.innerHTML = `<tr><td colspan="5" class="empty-row">Erreur de chargement.</td></tr>`;
  }
}

function dessinerPagination(page, totalPages) {
  const el = document.getElementById("livres-pagination");
  if (!totalPages || totalPages <= 1) { el.innerHTML = ""; return; }
  let html = "";
  for (let i = 1; i <= totalPages; i++) {
    html += `<button class="${i === page ? 'active' : ''}" onclick="allerPage(${i})">${i}</button>`;
  }
  el.innerHTML = html;
}
function allerPage(p) { livresPage = p; chargerLivres(); }

document.getElementById("livres-recherche").addEventListener("input", (e) => {
  livresRecherche = e.target.value;
  livresPage = 1;
  clearTimeout(window._rechercheTimeout);
  window._rechercheTimeout = setTimeout(chargerLivres, 300);
});

async function supprimerLivre(id) {
  if (!confirm("Supprimer ce livre ?")) return;
  try {
    await appel(`/livres/${id}`, { method: "DELETE" });
    toast("Livre supprimé");
    chargerLivres();
  } catch (e) {
    toast(e.message, true);
  }
}

function ouvrirNouveauLivre() {
  const options = auteursCache.map(a => `<option value="${a.id}">${a.nom}</option>`).join("");
  ouvrirModale("Ajouter un livre", `
    <div class="field">
      <label for="f-titre">Titre</label>
      <input id="f-titre" required>
    </div>
    <div class="field">
      <label for="f-annee">Année de publication</label>
      <input id="f-annee" type="number" required>
    </div>
    <div class="field">
      <label for="f-auteur">Auteur</label>
      <select id="f-auteur" required><option value="">Choisir un auteur</option>${options}</select>
    </div>
    <p class="field-error" id="form-error"></p>
    <div class="modal-actions">
      <button type="button" class="btn btn-ghost" id="modal-annuler">Annuler</button>
      <button type="submit" class="btn btn-primary">Ajouter</button>
    </div>
  `, async () => {
    const titre = document.getElementById("f-titre").value.trim();
    const annee = document.getElementById("f-annee").value;
    const auteur_id = document.getElementById("f-auteur").value;
    if (!titre || !annee || !auteur_id) {
      afficherErreurForm("Tous les champs sont obligatoires.");
      return;
    }
    try {
      await appel("/livres", { method: "POST", body: JSON.stringify({ titre, annee_publication: annee, auteur_id }) });
      toast("Livre ajouté");
      fermerModale();
      livresPage = 1;
      chargerLivres();
    } catch (e) {
      afficherErreurForm(e.message);
    }
  });
}

async function ouvrirModifLivre(id) {
  try {
    const livre = await appel(`/livres/${id}`);
    const options = auteursCache.map(a => `<option value="${a.id}" ${a.id === livre.auteur_id ? "selected" : ""}>${a.nom}</option>`).join("");
    ouvrirModale("Modifier le livre", `
      <div class="field">
        <label for="f-titre">Titre</label>
        <input id="f-titre" required value="${livre.titre}">
      </div>
      <div class="field">
        <label for="f-annee">Année de publication</label>
        <input id="f-annee" type="number" required value="${livre.annee_publication}">
      </div>
      <div class="field">
        <label for="f-auteur">Auteur</label>
        <select id="f-auteur" required>${options}</select>
      </div>
      <p class="field-error" id="form-error"></p>
      <div class="modal-actions">
        <button type="button" class="btn btn-ghost" id="modal-annuler">Annuler</button>
        <button type="submit" class="btn btn-primary">Enregistrer</button>
      </div>
    `, async () => {
      const titre = document.getElementById("f-titre").value.trim();
      const annee = document.getElementById("f-annee").value;
      const auteur_id = document.getElementById("f-auteur").value;
      try {
        await appel(`/livres/${id}`, { method: "PUT", body: JSON.stringify({ titre, annee_publication: annee, auteur_id }) });
        toast("Livre modifié");
        fermerModale();
        chargerLivres();
      } catch (e) {
        afficherErreurForm(e.message);
      }
    });
  } catch (e) {
    toast("Impossible de charger ce livre", true);
  }
}

document.getElementById("btn-nouveau-livre").addEventListener("click", ouvrirNouveauLivre);

// ---------- Adhérents ----------
async function chargerAdherents() {
  const tbody = document.getElementById("adherents-tbody");
  tbody.innerHTML = `<tr><td colspan="3" class="empty-row">Chargement…</td></tr>`;
  try {
    const adherents = await appel("/adherents");
    if (!adherents.length) {
      tbody.innerHTML = `<tr><td colspan="3" class="empty-row">Aucun adhérent inscrit.</td></tr>`;
      return;
    }
    tbody.innerHTML = adherents.map(a => `
      <tr>
        <td>${a.nom}</td>
        <td>${a.contact}</td>
        <td class="row-actions">
          <button class="btn btn-ghost btn-sm" onclick="voirHistorique(${a.id}, '${a.nom.replace(/'/g, "\\'")}')">Historique</button>
          <button class="btn btn-danger btn-sm" onclick="supprimerAdherent(${a.id})">Supprimer</button>
        </td>
      </tr>
    `).join("");
  } catch (e) {
    tbody.innerHTML = `<tr><td colspan="3" class="empty-row">Erreur de chargement.</td></tr>`;
  }
}

async function supprimerAdherent(id) {
  if (!confirm("Supprimer cet adhérent ?")) return;
  try {
    await appel(`/adherents/${id}`, { method: "DELETE" });
    toast("Adhérent supprimé");
    chargerAdherents();
  } catch (e) {
    toast(e.message, true);
  }
}

async function voirHistorique(id, nom) {
  try {
    const historique = await appel(`/adherents/${id}/emprunts`);
    const contenu = historique.length
      ? `<ul style="margin:0;padding-left:18px;">${historique.map(h => `<li>${h.livre_titre} — emprunté le ${formaterDate(h.date_emprunt)}${h.date_retour_effective ? `, rendu le ${formaterDate(h.date_retour_effective)}` : ' (en cours)'}</li>`).join("")}</ul>`
      : "<p>Aucun emprunt pour cet adhérent.</p>";
    ouvrirModale(`Historique — ${nom}`, `${contenu}<div class="modal-actions"><button type="button" class="btn btn-primary" id="modal-annuler">Fermer</button></div>`, (e) => { e.preventDefault(); fermerModale(); }, false);
  } catch (e) {
    toast("Impossible de charger l'historique", true);
  }
}

document.getElementById("btn-nouvel-adherent").addEventListener("click", () => {
  const aujourdHui = new Date().toISOString().split("T")[0];
  ouvrirModale("Ajouter un adhérent", `
    <div class="field">
      <label for="f-nom">Nom</label>
      <input id="f-nom" required>
    </div>
    <div class="field">
      <label for="f-contact">Contact</label>
      <input id="f-contact" required>
    </div>
    <div class="field">
      <label for="f-date-inscription">Date d'inscription</label>
      <input id="f-date-inscription" type="date" required value="${aujourdHui}">
    </div>
    <p class="field-error" id="form-error"></p>
    <div class="modal-actions">
      <button type="button" class="btn btn-ghost" id="modal-annuler">Annuler</button>
      <button type="submit" class="btn btn-primary">Ajouter</button>
    </div>
  `, async () => {
    const nom = document.getElementById("f-nom").value.trim();
    const contact = document.getElementById("f-contact").value.trim();
    const date_inscription = document.getElementById("f-date-inscription").value;
    if (!nom || !contact || !date_inscription) { afficherErreurForm("Tous les champs sont obligatoires."); return; }
    try {
      await appel("/adherents", { method: "POST", body: JSON.stringify({ nom, contact, date_inscription }) });
      toast("Adhérent ajouté");
      fermerModale();
      chargerAdherents();
    } catch (e) {
      afficherErreurForm(e.message);
    }
  });
});

// ---------- Emprunts ----------
async function chargerEmprunts() {
  const tbody = document.getElementById("emprunts-tbody");
  tbody.innerHTML = `<tr><td colspan="6" class="empty-row">Chargement…</td></tr>`;
  try {
    const emprunts = await appel("/emprunts");
    if (!emprunts.length) {
      tbody.innerHTML = `<tr><td colspan="6" class="empty-row">Aucun emprunt en cours.</td></tr>`;
      return;
    }
    tbody.innerHTML = emprunts.map(e => {
      const enRetard = !e.date_retour_effective && new Date(e.date_retour_prevue) < new Date();
      return `
        <tr>
          <td>${e.livre_titre}</td>
          <td>${e.adherent_nom}</td>
          <td>${formaterDate(e.date_emprunt)}</td>
          <td>${formaterDate(e.date_retour_prevue)}</td>
          <td><span class="badge badge--${enRetard ? 'retard' : 'encours'}">${enRetard ? 'En retard' : 'En cours'}</span></td>
          <td class="row-actions">
            <button class="btn btn-ghost btn-sm" onclick="enregistrerRetour(${e.id})">Marquer rendu</button>
          </td>
        </tr>
      `;
    }).join("");
  } catch (e) {
    tbody.innerHTML = `<tr><td colspan="6" class="empty-row">Erreur de chargement.</td></tr>`;
  }
}

async function enregistrerRetour(id) {
  try {
    await appel(`/emprunts/${id}/retour`, { method: "PUT" });
    toast("Retour enregistré");
    chargerEmprunts();
  } catch (e) {
    toast(e.message, true);
  }
}

document.getElementById("btn-nouvel-emprunt").addEventListener("click", async () => {
  let adherents = [];
  let livresDispo = [];
  try {
    [adherents, livresDispo] = await Promise.all([
      appel("/adherents"),
      appel("/livres?limite=200").then(d => d.livres.filter(l => l.statut === "disponible"))
    ]);
  } catch { /* on affiche quand même le formulaire, avec listes vides */ }

  ouvrirModale("Enregistrer un emprunt", `
    <div class="field">
      <label for="f-adherent">Adhérent</label>
      <select id="f-adherent" required>
        <option value="">Choisir un adhérent</option>
        ${adherents.map(a => `<option value="${a.id}">${a.nom}</option>`).join("")}
      </select>
    </div>
    <div class="field">
      <label for="f-livre">Livre disponible</label>
      <select id="f-livre" required>
        <option value="">Choisir un livre</option>
        ${livresDispo.map(l => `<option value="${l.id}">${l.titre}</option>`).join("")}
      </select>
    </div>
    <div class="field">
      <label for="f-date-retour">Date de retour prévue</label>
      <input id="f-date-retour" type="date" required>
    </div>
    <p class="field-error" id="form-error"></p>
    <div class="modal-actions">
      <button type="button" class="btn btn-ghost" id="modal-annuler">Annuler</button>
      <button type="submit" class="btn btn-primary">Enregistrer</button>
    </div>
  `, async () => {
    const adherent_id = document.getElementById("f-adherent").value;
    const livre_id = document.getElementById("f-livre").value;
    const date_retour_prevue = document.getElementById("f-date-retour").value;
    if (!adherent_id || !livre_id || !date_retour_prevue) {
      afficherErreurForm("Tous les champs sont obligatoires.");
      return;
    }
    try {
      await appel("/emprunts", { method: "POST", body: JSON.stringify({ adherent_id, livre_id, date_retour_prevue }) });
      toast("Emprunt enregistré");
      fermerModale();
      chargerEmprunts();
    } catch (e) {
      afficherErreurForm(e.message || "Ce livre n'est plus disponible.");
    }
  });
});

// ---------- Modale générique ----------
const backdrop = document.getElementById("modal-backdrop");
const modalTitle = document.getElementById("modal-title");
const modalForm = document.getElementById("modal-form");

function ouvrirModale(titre, html, onSubmit, isForm = true) {
  modalTitle.textContent = titre;
  modalForm.innerHTML = html;
  backdrop.classList.add("open");
  document.getElementById("modal-annuler").addEventListener("click", fermerModale);
  if (isForm) {
    modalForm.onsubmit = (e) => { e.preventDefault(); onSubmit(); };
  } else {
    modalForm.onsubmit = onSubmit;
  }
}

function fermerModale() {
  backdrop.classList.remove("open");
  modalForm.innerHTML = "";
}

function afficherErreurForm(message) {
  const el = document.getElementById("form-error");
  if (el) { el.textContent = message; el.classList.add("visible"); }
}

document.getElementById("modal-close").addEventListener("click", fermerModale);
backdrop.addEventListener("click", (e) => { if (e.target === backdrop) fermerModale(); });

// ---------- Démarrage ----------
(async function init() {
  await verifierApi();
  await rafraichirCacheAuteurs();
  chargerStatistiques();
})();