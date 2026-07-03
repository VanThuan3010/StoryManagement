$(function () {
    window.myCompose = {
        data: [],
        selectedId: null,       // 'nXX' (string) hoặc null
        pendingParentId: null,  // 'nXX' | null — dùng khi thêm mới (SelectId = 0)
        openNodes: new Set(),

        // ─── HELPERS ────────────────────────────────────────────────
        findNode: function (id, list) {
            for (const n of list) {
                if (n.id === id) return n;
                const r = myCompose.findNode(id, n.children);
                if (r) return r;
            }
            return null;
        },

        removeNode: function (id, list) {
            for (let i = 0; i < list.length; i++) {
                if (list[i].id === id) { list.splice(i, 1); return true; }
                if (myCompose.removeNode(id, list[i].children)) return true;
            }
            return false;
        },

        getDepth: function (id, list, d) {
            d = d || 0;
            for (const n of list) {
                if (n.id === id) return d;
                const r = myCompose.getDepth(id, n.children, d + 1);
                if (r !== -1) return r;
            }
            return -1;
        },

        getBreadcrumb: function (id, list, trail) {
            trail = trail || [];
            for (const n of list) {
                if (n.id === id) return [...trail, n.name];
                const r = myCompose.getBreadcrumb(id, n.children, [...trail, n.name]);
                if (r) return r;
            }
            return null;
        },

        escHtml: function (s) {
            return String(s)
                .replace(/&/g, '&amp;').replace(/</g, '&lt;')
                .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
        },

        toast: function (msg, type) {
            type = type || 'success';
            const wrap = document.getElementById('toastWrap');
            const el = document.createElement('div');
            el.className = 'toast ' + type;
            el.innerHTML = '<span>' + (type === 'success' ? '✓' : '✕') + '</span> ' + msg;
            wrap.appendChild(el);
            setTimeout(() => el.remove(), 2800);
        },

        // ─── TREE ───────────────────────────────────────────────────
        buildTree: function (rows) {
            const map = {};
            const roots = [];
            rows.forEach(r => {
                let ic = '📂';
                if (r.level === 2) ic = '📄';
                else if (r.level === 3) ic = '🍃';
                else if (r.level === 4) ic = '🔹';
                map[r.id] = {
                    id: 'n' + r.id,
                    _dbId: r.id,
                    name: r.name,
                    desc: r.description || '',
                    icon: ic,
                    content: '',
                    children: []
                };
            });
            rows.forEach(r => {
                if (r.parentId === 0) {
                    roots.push(map[r.id]);
                } else if (map[r.parentId]) {
                    map[r.parentId].children.push(map[r.id]);
                }
            });
            return roots;
        },

        loadTree: function () {
            $.get('/MyCompose/GetTree', function (rows) {
                myCompose.data = myCompose.buildTree(rows);
                myCompose.renderTree();
            });
        },

        toggleNode: function (id) {
            if (myCompose.openNodes.has(id)) myCompose.openNodes.delete(id);
            else myCompose.openNodes.add(id);
            myCompose.renderTree();
        },

        renderTree: function () {
            document.getElementById('treeRoot').innerHTML = '';
            myCompose.data.forEach(n => myCompose.renderNode(n, document.getElementById('treeRoot'), 0));
        },

        renderNode: function (node, container, depth) {
            const wrapper = document.createElement('div');
            wrapper.className = 'tree-node depth-' + depth;
            wrapper.dataset.id = node.id;

            const hasChildren = node.children.length > 0;
            const isOpen = myCompose.openNodes.has(node.id);
            const isSel = myCompose.selectedId === node.id;

            const row = document.createElement('div');
            row.className = 'node-row' + (isSel ? ' selected' : '');
            row.onclick = (e) => { e.stopPropagation(); myCompose.selectNode(node.id); };

            // toggle
            const tog = document.createElement('span');
            tog.className = 'node-toggle' + (hasChildren ? (isOpen ? ' open' : '') : ' leaf');
            tog.textContent = '▶';
            if (hasChildren) tog.onclick = (e) => { e.stopPropagation(); myCompose.toggleNode(node.id); };
            row.appendChild(tog);

            // icon
            const ico = document.createElement('span');
            ico.className = 'node-icon';
            ico.textContent = node.icon || '📄';
            row.appendChild(ico);

            // label
            const lbl = document.createElement('span');
            lbl.className = 'node-label';
            lbl.textContent = node.name;
            row.appendChild(lbl);

            // actions
            const acts = document.createElement('div');
            acts.className = 'node-actions';

            // nút thêm con (chỉ hiện nếu chưa đến cấp 4)
            if (depth < 3) {
                const btnAdd = document.createElement('button');
                btnAdd.className = 'node-btn add';
                btnAdd.title = 'Thêm node con';
                btnAdd.textContent = '＋';
                btnAdd.onclick = (e) => { e.stopPropagation(); myCompose.addNode(node.id); };
                acts.appendChild(btnAdd);
            }

            // nút xóa
            const btnDel = document.createElement('button');
            btnDel.className = 'node-btn danger';
            btnDel.title = 'Xoá';
            btnDel.textContent = '✕';
            btnDel.onclick = (e) => { e.stopPropagation(); myCompose.deleteNode(node.id); };
            acts.appendChild(btnDel);

            row.appendChild(acts);
            wrapper.appendChild(row);

            if (hasChildren) {
                const childWrap = document.createElement('div');
                childWrap.className = 'node-children' + (isOpen ? ' open' : '');
                node.children.forEach(c => myCompose.renderNode(c, childWrap, depth + 1));
                wrapper.appendChild(childWrap);
            }

            container.appendChild(wrapper);
        },

        // ─── SELECT / DETAIL ────────────────────────────────────────
        selectNode: function (id) {
            myCompose.selectedId = id;
            myCompose.renderTree();

            const node = myCompose.findNode(id, myCompose.data);
            if (node.content === '') {
                $.get('/MyCompose/GetDetail/' + node._dbId, function (row) {
                    node.content = row.contents || '';
                    myCompose.renderDetail(id);
                });
            } else {
                myCompose.renderDetail(id);
            }
        },

        renderDetail: function (id) {
            // id = null => form thêm mới
            const isNew = (id === null);
            const node = isNew ? null : myCompose.findNode(id, myCompose.data);

            if (CKEDITOR.instances['txtContent']) {
                CKEDITOR.instances['txtContent'].destroy(true);
            }

            let headHtml = '';
            let leftHtml = '';

            if (isNew) {
                // ── FORM THÊM MỚI ──
                const parentNode = myCompose.pendingParentId
                    ? myCompose.findNode(myCompose.pendingParentId, myCompose.data)
                    : null;
                const parentLabel = parentNode ? ('con của <b>' + myCompose.escHtml(parentNode.name) + '</b>') : 'node gốc';

                headHtml = `
                    <div class="content-head">
                        <div style="flex:1">
                            <h2>➕ Thêm ${parentLabel}</h2>
                        </div>
                    </div>`;
                leftHtml = `
                    <div class="field-group">
                        <label>Tên node <span style="color:var(--danger)">*</span></label>
                        <input type="text" id="detailName" placeholder="Nhập tên..." />
                    </div>
                    <div class="field-group">
                        <label>Mô tả</label>
                        <textarea id="detailDesc" placeholder="Mô tả (tuỳ chọn)..."></textarea>
                    </div>
                    <div class="form-actions">
                        <button class="btn btn-primary" onclick="myCompose.saveDetail()">💾 Lưu</button>
                        <button class="btn btn-ghost" onclick="myCompose.cancelAdd()">Huỷ</button>
                    </div>`;
            } else {
                // ── FORM SỬA ──
                const depth = myCompose.getDepth(id, myCompose.data);
                const crumbs = myCompose.getBreadcrumb(id, myCompose.data);

                headHtml = `
                    <div class="content-head">
                        <div style="flex:1">
                            <h2>${node.icon || ''} ${myCompose.escHtml(node.name)}</h2>
                            <div class="breadcrumb">
                                ${crumbs.map(c => '<span>' + myCompose.escHtml(c) + '</span>').join('')}
                            </div>
                        </div>
                        <button class="btn btn-danger" onclick="myCompose.deleteNode('${node.id}')">✕ Xoá</button>
                    </div>`;
                leftHtml = `
                    <div class="field-group">
                        <label>Tên node</label>
                        <input type="text" value="${myCompose.escHtml(node.name)}" id="detailName" />
                    </div>
                    <div class="field-group">
                        <label>Mô tả</label>
                        <textarea id="detailDesc">${myCompose.escHtml(node.desc || '')}</textarea>
                    </div>
                    <div class="form-actions">
                        <button class="btn btn-primary" onclick="myCompose.saveDetail('${node.id}')">💾 Lưu thay đổi</button>
                        ${depth < 3 ? '<button class="btn btn-ghost" onclick="myCompose.addNode(\'' + node.id + '\')">＋ Thêm node con</button>' : ''}
                    </div>`;
            }

            document.getElementById('contentPanel').innerHTML = `
                ${headHtml}
                <div class="content-body content-body--cols">
                    <div class="detail-col-left">${leftHtml}</div>
                    <div class="detail-col-right">
                        <div class="field-group" style="height:100%;display:flex;flex-direction:column;">
                            <label>Nội dung chi tiết</label>
                            <div class="ck-wrap">
                                <textarea id="txtContent">${isNew ? '' : myCompose.escHtml(node.content || '')}</textarea>
                            </div>
                        </div>
                    </div>
                </div>`;

            CKEDITOR.replace('txtContent', {
                language: 'vi',
                height: '100%',
                resize_enabled: false,
                toolbarGroups: [
                    { name: 'basicstyles', groups: ['basicstyles', 'cleanup'] },
                    { name: 'paragraph', groups: ['list', 'indent', 'blocks', 'align'] },
                    { name: 'links' },
                    { name: 'insert' },
                    { name: 'styles' },
                    { name: 'colors' },
                    '/'
                ],
                removeButtons: 'Subscript,Superscript,Strike,Anchor,Styles,Specialchar',
                contentsCss: [
                    'body { font-family: Segoe UI, sans-serif; font-size: 14px; color: #d6daf0; background: #181c27; padding: 12px 16px; line-height: 1.7; }'
                ]
            });
        },

        // ─── ADD ────────────────────────────────────────────────────
        // Thêm gốc: addNode(null)
        // Thêm con:  addNode('nXX')
        addNode: function (parentNodeId) {
            myCompose.selectedId = null;       // SelectId = 0
            myCompose.pendingParentId = parentNodeId || null;
            myCompose.renderTree();
            myCompose.renderDetail(null);           // form trắng
        },

        cancelAdd: function () {
            myCompose.pendingParentId = null;
            // quay về empty state
            if (CKEDITOR.instances['txtContent']) {
                CKEDITOR.instances['txtContent'].destroy(true);
            }
            document.getElementById('contentPanel').innerHTML = `
                <div class="content-body">
                    <div class="empty-state">
                        <div class="icon">🌿</div>
                        <p>Chọn một node để xem chi tiết</p>
                    </div>
                </div>`;
        },

        // ─── SAVE ───────────────────────────────────────────────────
        // id = undefined/null => thêm mới; id = 'nXX' => cập nhật
        saveDetail: function (id) {
            const name = (document.getElementById('detailName').value || '').trim();
            const desc = (document.getElementById('detailDesc').value || '').trim();
            const content = CKEDITOR.instances['txtContent']
                ? CKEDITOR.instances['txtContent'].getData()
                : '';

            if (!name) {
                document.getElementById('detailName').style.borderColor = 'var(--danger)';
                document.getElementById('detailName').focus();
                return;
            }
            document.getElementById('detailName').style.borderColor = '';

            let dbId = 0;
            let parentDbId = 0;

            if (!id) {
                // ── THÊM MỚI ──
                const parentNode = myCompose.pendingParentId
                    ? myCompose.findNode(myCompose.pendingParentId, myCompose.data)
                    : null;
                parentDbId = parentNode ? parentNode._dbId : 0;
            } else {
                // ── CẬP NHẬT ──
                const node = myCompose.findNode(id, myCompose.data);
                if (!node) return;
                dbId = node._dbId;
            }

            $.post('/MyCompose/CreateOrUpdate', {
                Id: dbId,
                Name: name,
                Description: desc,
                Contents: content,
                ParentId: parentDbId
            })
                .done(function (res) {
                    if (!res.status) {
                        myCompose.toast(res.message || 'Có lỗi xảy ra', 'error');
                        return;
                    }

                    myCompose.toast(res.message, 'success');
                    myCompose.pendingParentId = null;
                    myCompose.loadTree();
                })
                .fail(function () {
                    myCompose.toast('Có lỗi kết nối', 'error');
                });
        },

        // ─── DELETE ─────────────────────────────────────────────────
        deleteNode: function (id) {
            const node = myCompose.findNode(id, myCompose.data);
            if (!node) return;

            $.confirm({
                title: 'Xác nhận xoá',
                content: 'Bạn sẽ xoá <b>' + myCompose.escHtml(node.name) + '</b> và toàn bộ node con bên dưới.<br>Hành động này <b>không thể hoàn tác</b>.',
                type: 'red',
                buttons: {
                    xoa: {
                        text: 'Xoá',
                        btnClass: 'btn-danger',
                        action: function () {
                            const dbId = node._dbId;

                            $.post('/MyCompose/Delete', { Id: dbId })
                                .done(function (res) {
                                    if (!res.status) {
                                        myCompose.toast(res.message || 'Xoá thất bại', 'error');
                                        return;
                                    }

                                    myCompose.removeNode(id, myCompose.data);
                                    if (myCompose.selectedId === id) {
                                        myCompose.selectedId = null;
                                        if (CKEDITOR.instances['txtContent']) {
                                            CKEDITOR.instances['txtContent'].destroy(true);
                                        }
                                        document.getElementById('contentPanel').innerHTML = `
                        <div class="content-body">
                            <div class="empty-state">
                                <div class="icon">🌿</div>
                                <p>Chọn một node để xem chi tiết</p>
                            </div>
                        </div>`;
                                    }
                                    myCompose.renderTree();
                                    myCompose.toast(res.message || 'Đã xoá "' + node.name + '"', 'success');
                                })
                                .fail(function () {
                                    myCompose.toast('Xoá thất bại (lỗi kết nối)', 'error');
                                });
                        }
                    },
                    huy: {
                        text: 'Huỷ'
                    }
                }
            });
        },

        // ─── INIT ───────────────────────────────────────────────────
        init: function () {
            myCompose.loadTree();
        }
    };
});

$(document).ready(function () {
    myCompose.init();
});