'use strict';

var view = require('@codemirror/view');
var state = require('@codemirror/state');
var obsidian = require('obsidian');

var _documentCurrentScript = typeof document !== 'undefined' ? document.currentScript : null;
/******************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */
/* global Reflect, Promise, SuppressedError, Symbol */

var extendStatics = function(d, b) {
    extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
    return extendStatics(d, b);
};

function __extends(d, b) {
    if (typeof b !== "function" && b !== null)
        throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
    extendStatics(d, b);
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
}

var __assign = function() {
    __assign = Object.assign || function __assign(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};

typeof SuppressedError === "function" ? SuppressedError : function (error, suppressed, message) {
    var e = new Error(message);
    return e.name = "SuppressedError", e.error = error, e.suppressed = suppressed, e;
};

function crelt() {
  var elt = arguments[0];
  if (typeof elt == "string") elt = document.createElement(elt);
  var i = 1, next = arguments[1];
  if (next && typeof next == "object" && next.nodeType == null && !Array.isArray(next)) {
    for (var name in next) if (Object.prototype.hasOwnProperty.call(next, name)) {
      var value = next[name];
      if (typeof value == "string") elt.setAttribute(name, value);
      else if (value != null) elt[name] = value;
    }
    i++;
  }
  for (; i < arguments.length; i++) add(elt, arguments[i]);
  return elt
}

function add(elt, child) {
  if (typeof child == "string") {
    elt.appendChild(document.createTextNode(child));
  } else if (child == null) ; else if (child.nodeType != null) {
    elt.appendChild(child);
  } else if (Array.isArray(child)) {
    for (var i = 0; i < child.length; i++) add(elt, child[i]);
  } else {
    throw new RangeError("Unsupported child node: " + child)
  }
}

var SelectedDiagnostic = /** @class */ (function () {
    function SelectedDiagnostic(from, to, diagnostic) {
        this.from = from;
        this.to = to;
        this.diagnostic = diagnostic;
    }
    return SelectedDiagnostic;
}());
var LintState = /** @class */ (function () {
    function LintState(diagnostics, panel, selected) {
        this.diagnostics = diagnostics;
        this.panel = panel;
        this.selected = selected;
    }
    LintState.init = function (diagnostics, panel, state) {
        // Filter the list of diagnostics for which to create markers
        var markedDiagnostics = diagnostics;
        var diagnosticFilter = state.facet(lintConfig).markerFilter;
        if (diagnosticFilter)
            markedDiagnostics = diagnosticFilter(markedDiagnostics, state);
        var ranges = view.Decoration.set(markedDiagnostics.map(function (d) {
            // For zero-length ranges or ranges covering only a line break, create a widget
            return d.from == d.to || (d.from == d.to - 1 && state.doc.lineAt(d.from).to == d.from)
                ? view.Decoration.widget({
                    widget: new DiagnosticWidget(d),
                    diagnostic: d
                }).range(d.from)
                : view.Decoration.mark({
                    attributes: {
                        class: 'cm-lintRange cm-lintRange-' + d.severity + (d.markClass ? ' ' + d.markClass : '')
                    },
                    diagnostic: d
                }).range(d.from, d.to);
        }), true);
        return new LintState(ranges, panel, findDiagnostic(ranges));
    };
    return LintState;
}());
function findDiagnostic(diagnostics, diagnostic, after) {
    if (diagnostic === void 0) { diagnostic = null; }
    if (after === void 0) { after = 0; }
    var found = null;
    diagnostics.between(after, 1e9, function (from, to, _a) {
        var spec = _a.spec;
        if (diagnostic && spec.diagnostic != diagnostic)
            return;
        found = new SelectedDiagnostic(from, to, spec.diagnostic);
        return false;
    });
    return found;
}
function hideTooltip(tr, tooltip) {
    var from = tooltip.pos, to = tooltip.end || from;
    var result = tr.state.facet(lintConfig).hideOn(tr, from, to);
    if (result != null)
        return result;
    var line = tr.startState.doc.lineAt(tooltip.pos);
    return !!(tr.effects.some(function (e) { return e.is(setDiagnosticsEffect); }) ||
        tr.changes.touchesRange(line.from, Math.max(line.to, to)));
}
function maybeEnableLint(state$1, effects) {
    return state$1.field(lintState, false)
        ? effects
        : effects.concat(state.StateEffect.appendConfig.of(lintExtensions));
}
/// Returns a transaction spec which updates the current set of
/// diagnostics, and enables the lint extension if if wasn't already
/// active.
function setDiagnostics(state, diagnostics) {
    return {
        effects: maybeEnableLint(state, [setDiagnosticsEffect.of(diagnostics)])
    };
}
/// The state effect that updates the set of active diagnostics. Can
/// be useful when writing an extension that needs to track these.
var setDiagnosticsEffect = state.StateEffect.define();
var togglePanel = state.StateEffect.define();
var movePanelSelection = state.StateEffect.define();
var lintState = state.StateField.define({
    create: function () {
        return new LintState(view.Decoration.none, null, null);
    },
    update: function (value, tr) {
        if (tr.docChanged && value.diagnostics.size) {
            var mapped = value.diagnostics.map(tr.changes);
            var selected = null;
            var panel = value.panel;
            if (value.selected) {
                var selPos = tr.changes.mapPos(value.selected.from, 1);
                selected =
                    findDiagnostic(mapped, value.selected.diagnostic, selPos) ||
                        findDiagnostic(mapped, null, selPos);
            }
            if (!mapped.size && panel && tr.state.facet(lintConfig).autoPanel)
                panel = null;
            value = new LintState(mapped, panel, selected);
        }
        for (var _i = 0, _a = tr.effects; _i < _a.length; _i++) {
            var effect = _a[_i];
            if (effect.is(setDiagnosticsEffect)) {
                var panel = !tr.state.facet(lintConfig).autoPanel
                    ? value.panel
                    : effect.value.length
                        ? LintPanel.open
                        : null;
                value = LintState.init(effect.value, panel, tr.state);
            }
            else if (effect.is(togglePanel)) {
                value = new LintState(value.diagnostics, effect.value ? LintPanel.open : null, value.selected);
            }
            else if (effect.is(movePanelSelection)) {
                value = new LintState(value.diagnostics, value.panel, effect.value);
            }
        }
        return value;
    },
    provide: function (f) { return [
        view.showPanel.from(f, function (val) { return val.panel; }),
        view.EditorView.decorations.from(f, function (s) { return s.diagnostics; })
    ]; }
});
var activeMark = view.Decoration.mark({ class: 'cm-lintRange cm-lintRange-active' });
function lintTooltip(view, pos, side) {
    var diagnostics = view.state.field(lintState).diagnostics;
    var found = [], stackStart = 2e8, stackEnd = 0;
    diagnostics.between(pos - (side < 0 ? 1 : 0), pos + (side > 0 ? 1 : 0), function (from, to, _a) {
        var spec = _a.spec;
        if (pos >= from &&
            pos <= to &&
            (from == to || ((pos > from || side > 0) && (pos < to || side < 0)))) {
            found.push(spec.diagnostic);
            stackStart = Math.min(from, stackStart);
            stackEnd = Math.max(to, stackEnd);
        }
    });
    var diagnosticFilter = view.state.facet(lintConfig).tooltipFilter;
    if (diagnosticFilter)
        found = diagnosticFilter(found, view.state);
    if (!found.length)
        return null;
    return {
        pos: stackStart,
        end: stackEnd,
        above: view.state.doc.lineAt(stackStart).to < stackEnd,
        create: function () {
            return { dom: diagnosticsTooltip(view, found) };
        }
    };
}
function diagnosticsTooltip(view, diagnostics) {
    return crelt('ul', { class: 'cm-tooltip-lint' }, diagnostics.map(function (d) { return renderDiagnostic(view, d, false); }));
}
/// Command to close the lint panel, when open.
var closeLintPanel = function (view) {
    var field = view.state.field(lintState, false);
    if (!field || !field.panel)
        return false;
    view.dispatch({ effects: togglePanel.of(false) });
    return true;
};
var lintPlugin = view.ViewPlugin.fromClass(/** @class */ (function () {
    function class_1(view) {
        this.view = view;
        this.timeout = -1;
        this.set = true;
        var delay = view.state.facet(lintConfig).delay;
        this.lintTime = Date.now() + delay;
        this.run = this.run.bind(this);
        this.timeout = setTimeout(this.run, delay);
    }
    class_1.prototype.run = function () {
        var _this = this;
        clearTimeout(this.timeout);
        var now = Date.now();
        if (now < this.lintTime - 10) {
            this.timeout = setTimeout(this.run, this.lintTime - now);
        }
        else {
            this.set = false;
            var state_1 = this.view.state, sources = state_1.facet(lintConfig).sources;
            if (sources.length)
                Promise.all(sources.map(function (source) { return Promise.resolve(source(_this.view)); })).then(function (annotations) {
                    var all = annotations.reduce(function (a, b) { return a.concat(b); });
                    if (_this.view.state.doc == state_1.doc)
                        _this.view.dispatch(setDiagnostics(_this.view.state, all));
                }, function (error) {
                    view.logException(_this.view.state, error);
                });
        }
    };
    class_1.prototype.update = function (update) {
        var config = update.state.facet(lintConfig);
        if (update.docChanged ||
            config != update.startState.facet(lintConfig) ||
            (config.needsRefresh && config.needsRefresh(update))) {
            this.lintTime = Date.now() + config.delay;
            if (!this.set) {
                this.set = true;
                this.timeout = setTimeout(this.run, config.delay);
            }
        }
    };
    class_1.prototype.force = function () {
        if (this.set) {
            this.lintTime = Date.now();
            this.run();
        }
    };
    class_1.prototype.destroy = function () {
        clearTimeout(this.timeout);
    };
    return class_1;
}()));
var lintConfig = state.Facet.define({
    combine: function (input) {
        return __assign({ sources: input.map(function (i) { return i.source; }).filter(function (x) { return x != null; }) }, state.combineConfig(input.map(function (i) { return i.config; }), {
            delay: 750,
            markerFilter: null,
            tooltipFilter: null,
            needsRefresh: null,
            hideOn: function () { return null; }
        }, {
            needsRefresh: function (a, b) { return (!a ? b : !b ? a : function (u) { return a(u) || b(u); }); }
        }));
    }
});
/// Given a diagnostic source, this function returns an extension that
/// enables linting with that source. It will be called whenever the
/// editor is idle (after its content changed). If `null` is given as
/// source, this only configures the lint extension.
function linter(source, config) {
    if (config === void 0) { config = {}; }
    return [lintConfig.of({ source: source, config: config }), lintPlugin, lintExtensions];
}
function assignKeys(actions) {
    var assigned = [];
    if (actions)
        actions: for (var _i = 0, actions_1 = actions; _i < actions_1.length; _i++) {
            var name_1 = actions_1[_i].name;
            var _loop_1 = function (i) {
                var ch = name_1[i];
                if (/[a-zA-Z]/.test(ch) && !assigned.some(function (c) { return c.toLowerCase() == ch.toLowerCase(); })) {
                    assigned.push(ch);
                    return "continue-actions";
                }
            };
            for (var i = 0; i < name_1.length; i++) {
                var state_2 = _loop_1(i);
                switch (state_2) {
                    case "continue-actions": continue actions;
                }
            }
            assigned.push('');
        }
    return assigned;
}
function renderDiagnostic(view, diagnostic, inPanel) {
    var _a;
    var keys = inPanel ? assignKeys(diagnostic.actions) : [];
    return crelt('li', { class: 'cm-diagnostic cm-diagnostic-' + diagnostic.severity }, crelt('span', { class: 'cm-diagnosticTitle' }, diagnostic.title), crelt('span', { class: 'cm-diagnosticText' }, diagnostic.renderMessage ? diagnostic.renderMessage(view) : diagnostic.message), (_a = diagnostic.actions) === null || _a === void 0 ? void 0 : _a.map(function (action, i) {
        var fired = false;
        var click = function (e) {
            e.preventDefault();
            if (fired)
                return;
            fired = true;
            var found = findDiagnostic(view.state.field(lintState).diagnostics, diagnostic);
            if (found)
                action.apply(view, found.from, found.to);
        };
        var name = action.name, keyIndex = keys[i] ? name.indexOf(keys[i]) : -1;
        var nameElt = keyIndex < 0
            ? name
            : [
                name.slice(0, keyIndex),
                crelt('u', name.slice(keyIndex, keyIndex + 1)),
                name.slice(keyIndex + 1)
            ];
        return crelt('button', {
            type: 'button',
            class: 'cm-diagnosticAction',
            onclick: click,
            onmousedown: click,
            'aria-label': " Action: ".concat(name).concat(keyIndex < 0 ? '' : " (access key \"".concat(keys[i], ")\""), ".")
        }, nameElt);
    }), diagnostic.source && crelt('div', { class: 'cm-diagnosticSource' }, diagnostic.source));
}
var DiagnosticWidget = /** @class */ (function (_super) {
    __extends(DiagnosticWidget, _super);
    function DiagnosticWidget(diagnostic) {
        var _this = _super.call(this) || this;
        _this.diagnostic = diagnostic;
        return _this;
    }
    DiagnosticWidget.prototype.eq = function (other) {
        return other.diagnostic == this.diagnostic;
    };
    DiagnosticWidget.prototype.toDOM = function () {
        return crelt('span', { class: 'cm-lintPoint cm-lintPoint-' + this.diagnostic.severity });
    };
    return DiagnosticWidget;
}(view.WidgetType));
var PanelItem = /** @class */ (function () {
    function PanelItem(view, diagnostic) {
        this.diagnostic = diagnostic;
        this.id = 'item_' + Math.floor(Math.random() * 0xffffffff).toString(16);
        this.dom = renderDiagnostic(view, diagnostic, true);
        this.dom.id = this.id;
        this.dom.setAttribute('role', 'option');
    }
    return PanelItem;
}());
var LintPanel = /** @class */ (function () {
    function LintPanel(view) {
        var _this = this;
        this.view = view;
        this.items = [];
        var onkeydown = function (event) {
            if (event.keyCode == 27) {
                // Escape
                closeLintPanel(_this.view);
                _this.view.focus();
            }
            else if (event.keyCode == 38 || event.keyCode == 33) {
                // ArrowUp, PageUp
                _this.moveSelection((_this.selectedIndex - 1 + _this.items.length) % _this.items.length);
            }
            else if (event.keyCode == 40 || event.keyCode == 34) {
                // ArrowDown, PageDown
                _this.moveSelection((_this.selectedIndex + 1) % _this.items.length);
            }
            else if (event.keyCode == 36) {
                // Home
                _this.moveSelection(0);
            }
            else if (event.keyCode == 35) {
                // End
                _this.moveSelection(_this.items.length - 1);
            }
            else if (event.keyCode == 13) {
                // Enter
                _this.view.focus();
            }
            else if (event.keyCode >= 65 && event.keyCode <= 90 && _this.selectedIndex >= 0) {
                // A-Z
                var diagnostic = _this.items[_this.selectedIndex].diagnostic, keys = assignKeys(diagnostic.actions);
                for (var i = 0; i < keys.length; i++)
                    if (keys[i].toUpperCase().charCodeAt(0) == event.keyCode) {
                        var found = findDiagnostic(_this.view.state.field(lintState).diagnostics, diagnostic);
                        if (found)
                            diagnostic.actions[i].apply(view, found.from, found.to);
                    }
            }
            else {
                return;
            }
            event.preventDefault();
        };
        var onclick = function (event) {
            for (var i = 0; i < _this.items.length; i++) {
                if (_this.items[i].dom.contains(event.target))
                    _this.moveSelection(i);
            }
        };
        this.list = crelt('ul', {
            tabIndex: 0,
            role: 'listbox',
            'aria-label': this.view.state.phrase('Diagnostics'),
            onkeydown: onkeydown,
            onclick: onclick
        });
        this.dom = crelt('div', { class: 'cm-panel-lint' }, this.list, crelt('button', {
            type: 'button',
            name: 'close',
            'aria-label': this.view.state.phrase('close'),
            onclick: function () { return closeLintPanel(_this.view); }
        }, '×'));
        this.update();
    }
    Object.defineProperty(LintPanel.prototype, "selectedIndex", {
        get: function () {
            var selected = this.view.state.field(lintState).selected;
            if (!selected)
                return -1;
            for (var i = 0; i < this.items.length; i++)
                if (this.items[i].diagnostic == selected.diagnostic)
                    return i;
            return -1;
        },
        enumerable: false,
        configurable: true
    });
    LintPanel.prototype.update = function () {
        var _this = this;
        var _a = this.view.state.field(lintState), diagnostics = _a.diagnostics, selected = _a.selected;
        var i = 0, needsSync = false, newSelectedItem = null;
        diagnostics.between(0, this.view.state.doc.length, function (_start, _end, _a) {
            var spec = _a.spec;
            var found = -1, item;
            for (var j = i; j < _this.items.length; j++)
                if (_this.items[j].diagnostic == spec.diagnostic) {
                    found = j;
                    break;
                }
            if (found < 0) {
                item = new PanelItem(_this.view, spec.diagnostic);
                _this.items.splice(i, 0, item);
                needsSync = true;
            }
            else {
                item = _this.items[found];
                if (found > i) {
                    _this.items.splice(i, found - i);
                    needsSync = true;
                }
            }
            if (selected && item.diagnostic == selected.diagnostic) {
                if (!item.dom.hasAttribute('aria-selected')) {
                    item.dom.setAttribute('aria-selected', 'true');
                    newSelectedItem = item;
                }
            }
            else if (item.dom.hasAttribute('aria-selected')) {
                item.dom.removeAttribute('aria-selected');
            }
            i++;
        });
        while (i < this.items.length &&
            !(this.items.length == 1 && this.items[0].diagnostic.from < 0)) {
            needsSync = true;
            this.items.pop();
        }
        if (this.items.length == 0) {
            this.items.push(new PanelItem(this.view, {
                from: -1,
                to: -1,
                severity: 'info',
                message: this.view.state.phrase('No diagnostics')
            }));
            needsSync = true;
        }
        if (newSelectedItem) {
            this.list.setAttribute('aria-activedescendant', newSelectedItem.id);
            this.view.requestMeasure({
                key: this,
                read: function () { return ({
                    sel: newSelectedItem.dom.getBoundingClientRect(),
                    panel: _this.list.getBoundingClientRect()
                }); },
                write: function (_a) {
                    var sel = _a.sel, panel = _a.panel;
                    var scaleY = panel.height / _this.list.offsetHeight;
                    if (sel.top < panel.top)
                        _this.list.scrollTop -= (panel.top - sel.top) / scaleY;
                    else if (sel.bottom > panel.bottom)
                        _this.list.scrollTop += (sel.bottom - panel.bottom) / scaleY;
                }
            });
        }
        else if (this.selectedIndex < 0) {
            this.list.removeAttribute('aria-activedescendant');
        }
        if (needsSync)
            this.sync();
    };
    LintPanel.prototype.sync = function () {
        var domPos = this.list.firstChild;
        function rm() {
            var prev = domPos;
            domPos = prev.nextSibling;
            prev.remove();
        }
        for (var _i = 0, _a = this.items; _i < _a.length; _i++) {
            var item = _a[_i];
            if (item.dom.parentNode == this.list) {
                while (domPos != item.dom)
                    rm();
                domPos = item.dom.nextSibling;
            }
            else {
                this.list.insertBefore(item.dom, domPos);
            }
        }
        while (domPos)
            rm();
    };
    LintPanel.prototype.moveSelection = function (selectedIndex) {
        if (this.selectedIndex < 0)
            return;
        var field = this.view.state.field(lintState);
        var selection = findDiagnostic(field.diagnostics, this.items[selectedIndex].diagnostic);
        if (!selection)
            return;
        this.view.dispatch({
            selection: { anchor: selection.from, head: selection.to },
            scrollIntoView: true,
            effects: movePanelSelection.of(selection)
        });
    };
    LintPanel.open = function (view) {
        return new LintPanel(view);
    };
    return LintPanel;
}());
function svg(content, attrs) {
    if (attrs === void 0) { attrs = "viewBox=\"0 0 40 40\""; }
    return "url('data:image/svg+xml,<svg xmlns=\"http://www.w3.org/2000/svg\" ".concat(attrs, ">").concat(encodeURIComponent(content), "</svg>')");
}
function underline(color) {
    return svg("<path d=\"m0 2.5 l2 -1.5 l1 0 l2 1.5 l1 0\" stroke=\"".concat(color, "\" fill=\"none\" stroke-width=\".7\"/>"), "width=\"6\" height=\"3\"");
}
var baseTheme = view.EditorView.baseTheme({
    '.cm-diagnostic': {
        padding: '4px',
        marginLeft: '0px',
        display: 'flex',
        flexDirection: 'column',
        whiteSpace: 'pre-wrap'
    },
    '.cm-diagnosticTitle': {
        boxShadow: 'inset 0 -2px #DB2B39',
        width: 'max-content',
        fontWeight: 'bold'
    },
    '.cm-diagnosticText': {
        marginTop: '8px'
    },
    '.cm-diagnosticAction': {
        font: 'inherit',
        border: 'none',
        marginTop: '8px',
        display: 'flex',
        alignItems: 'center',
        gap: 'var(--size-4-2)',
        padding: 'var(--size-4-1) var(--size-4-2)',
        cursor: 'var(--cursor)',
        fontSize: 'var(--font-ui-small)',
        borderRadius: 'var(--radius-s)',
        whiteSpace: 'nowrap',
        width: '100%'
    },
    '.cm-tooltip': {
        padding: 'var(--size-2-3) !important',
        border: '1px solid var(--background-modifier-border-hover) !important',
        backgroundColor: 'var(--background-secondary) !important',
        borderRadius: 'var(--radius-m) !important',
        boxShadow: 'var(--shadow-s) !important',
        zIndex: 'var(--layer-menu) !important',
        userSelect: 'none !important',
        maxHeight: 'calc(100% - var(--header-height)) !important',
        overflow: 'hidden !important'
    },
    '.cm-diagnosticSource': {
        fontSize: '70%',
        opacity: 0.7
    },
    '.cm-lintRange': {
        backgroundPosition: 'left bottom',
        backgroundRepeat: 'repeat-x',
        paddingBottom: '0.7px'
    },
    '.cm-lintRange-error': { backgroundImage: underline('#d11') },
    '.cm-lintRange-warning': { backgroundImage: underline('orange') },
    '.cm-lintRange-info': { backgroundImage: underline('#999') },
    '.cm-lintRange-hint': { backgroundImage: underline('#66d') },
    '.cm-lintRange-active': { backgroundColor: '#ffdd9980' },
    '.cm-tooltip-lint': {
        padding: 0,
        margin: 0
    },
    '.cm-lintPoint': {
        position: 'relative',
        '&:after': {
            content: '""',
            position: 'absolute',
            bottom: 0,
            left: '-2px',
            borderLeft: '3px solid transparent',
            borderRight: '3px solid transparent',
            borderBottom: '4px solid #d11'
        }
    },
    '.cm-lintPoint-warning': {
        '&:after': { borderBottomColor: 'orange' }
    },
    '.cm-lintPoint-info': {
        '&:after': { borderBottomColor: '#999' }
    },
    '.cm-lintPoint-hint': {
        '&:after': { borderBottomColor: '#66d' }
    },
    '.cm-panel.cm-panel-lint': {
        position: 'relative',
        '& ul': {
            maxHeight: '100px',
            overflowY: 'auto',
            '& [aria-selected]': {
                backgroundColor: '#ddd',
                '& u': { textDecoration: 'underline' }
            },
            '&:focus [aria-selected]': {
                background_fallback: '#bdf',
                backgroundColor: 'Highlight',
                color_fallback: 'white',
                color: 'HighlightText'
            },
            '& u': { textDecoration: 'none' },
            padding: 0,
            margin: 0
        },
        '& [name=close]': {
            position: 'absolute',
            top: '0',
            right: '2px',
            background: 'inherit',
            border: 'none',
            font: 'inherit',
            padding: 0,
            margin: 0
        }
    }
});
function severityWeight(sev) {
    return sev == 'error' ? 4 : sev == 'warning' ? 3 : sev == 'info' ? 2 : 1;
}
var LintGutterMarker = /** @class */ (function (_super) {
    __extends(LintGutterMarker, _super);
    function LintGutterMarker(diagnostics) {
        var _this = _super.call(this) || this;
        _this.diagnostics = diagnostics;
        _this.severity = diagnostics.reduce(function (max, d) { return (severityWeight(max) < severityWeight(d.severity) ? d.severity : max); }, 'hint');
        return _this;
    }
    LintGutterMarker.prototype.toDOM = function (view) {
        var elt = document.createElement('div');
        elt.className = 'cm-lint-marker cm-lint-marker-' + this.severity;
        var diagnostics = this.diagnostics;
        var diagnosticsFilter = view.state.facet(lintGutterConfig).tooltipFilter;
        if (diagnosticsFilter)
            diagnostics = diagnosticsFilter(diagnostics, view.state);
        if (diagnostics.length)
            elt.onmouseover = function () { return gutterMarkerMouseOver(view, elt, diagnostics); };
        return elt;
    };
    return LintGutterMarker;
}(view.GutterMarker));
function trackHoverOn(view, marker) {
    var mousemove = function (event) {
        var rect = marker.getBoundingClientRect();
        if (event.clientX > rect.left - 10 /* Hover.Margin */ &&
            event.clientX < rect.right + 10 /* Hover.Margin */ &&
            event.clientY > rect.top - 10 /* Hover.Margin */ &&
            event.clientY < rect.bottom + 10 /* Hover.Margin */)
            return;
        for (var target = event.target; target; target = target.parentNode) {
            if (target.nodeType == 1 && target.classList.contains('cm-tooltip-lint'))
                return;
        }
        window.removeEventListener('mousemove', mousemove);
        if (view.state.field(lintGutterTooltip))
            view.dispatch({ effects: setLintGutterTooltip.of(null) });
    };
    window.addEventListener('mousemove', mousemove);
}
function gutterMarkerMouseOver(view, marker, diagnostics) {
    function hovered() {
        var line = view.elementAtHeight(marker.getBoundingClientRect().top + 5 - view.documentTop);
        var linePos = view.coordsAtPos(line.from);
        if (linePos) {
            view.dispatch({
                effects: setLintGutterTooltip.of({
                    pos: line.from,
                    above: false,
                    create: function () {
                        return {
                            dom: diagnosticsTooltip(view, diagnostics),
                            getCoords: function () { return marker.getBoundingClientRect(); }
                        };
                    }
                })
            });
        }
        marker.onmouseout = marker.onmousemove = null;
        trackHoverOn(view, marker);
    }
    var hoverTime = view.state.facet(lintGutterConfig).hoverTime;
    var hoverTimeout = setTimeout(hovered, hoverTime);
    marker.onmouseout = function () {
        clearTimeout(hoverTimeout);
        marker.onmouseout = marker.onmousemove = null;
    };
    marker.onmousemove = function () {
        clearTimeout(hoverTimeout);
        hoverTimeout = setTimeout(hovered, hoverTime);
    };
}
function markersForDiagnostics(doc, diagnostics) {
    var byLine = Object.create(null);
    for (var _i = 0, diagnostics_1 = diagnostics; _i < diagnostics_1.length; _i++) {
        var diagnostic = diagnostics_1[_i];
        var line = doc.lineAt(diagnostic.from);
        (byLine[line.from] || (byLine[line.from] = [])).push(diagnostic);
    }
    var markers = [];
    for (var line in byLine) {
        markers.push(new LintGutterMarker(byLine[line]).range(+line));
    }
    return state.RangeSet.of(markers, true);
}
view.gutter({
    class: 'cm-gutter-lint',
    markers: function (view) { return view.state.field(lintGutterMarkers); }
});
var lintGutterMarkers = state.StateField.define({
    create: function () {
        return state.RangeSet.empty;
    },
    update: function (markers, tr) {
        markers = markers.map(tr.changes);
        var diagnosticFilter = tr.state.facet(lintGutterConfig).markerFilter;
        for (var _i = 0, _a = tr.effects; _i < _a.length; _i++) {
            var effect = _a[_i];
            if (effect.is(setDiagnosticsEffect)) {
                var diagnostics = effect.value;
                if (diagnosticFilter)
                    diagnostics = diagnosticFilter(diagnostics || [], tr.state);
                markers = markersForDiagnostics(tr.state.doc, diagnostics.slice(0));
            }
        }
        return markers;
    }
});
var setLintGutterTooltip = state.StateEffect.define();
var lintGutterTooltip = state.StateField.define({
    create: function () {
        return null;
    },
    update: function (tooltip, tr) {
        if (tooltip && tr.docChanged)
            tooltip = hideTooltip(tr, tooltip)
                ? null
                : __assign(__assign({}, tooltip), { pos: tr.changes.mapPos(tooltip.pos) });
        return tr.effects.reduce(function (t, e) { return (e.is(setLintGutterTooltip) ? e.value : t); }, tooltip);
    },
    provide: function (field) { return view.showTooltip.from(field); }
});
view.EditorView.baseTheme({
    '.cm-gutter-lint': {
        width: '1.4em',
        '& .cm-gutterElement': {
            padding: '.2em'
        }
    },
    '.cm-lint-marker': {
        width: '1em',
        height: '1em'
    },
    '.cm-lint-marker-info': {
        content: svg("<path fill=\"#aaf\" stroke=\"#77e\" stroke-width=\"6\" stroke-linejoin=\"round\" d=\"M5 5L35 5L35 35L5 35Z\"/>")
    },
    '.cm-lint-marker-warning': {
        content: svg("<path fill=\"#fe8\" stroke=\"#fd7\" stroke-width=\"6\" stroke-linejoin=\"round\" d=\"M20 6L37 35L3 35Z\"/>")
    },
    '.cm-lint-marker-error': {
        content: svg("<circle cx=\"20\" cy=\"20\" r=\"15\" fill=\"#f87\" stroke=\"#f43\" stroke-width=\"6\"/>")
    }
});
var lintExtensions = [
    lintState,
    view.EditorView.decorations.compute([lintState], function (state) {
        var _a = state.field(lintState), selected = _a.selected, panel = _a.panel;
        return !selected || !panel || selected.from == selected.to
            ? view.Decoration.none
            : view.Decoration.set([activeMark.range(selected.from, selected.to)]);
    }),
    view.hoverTooltip(lintTooltip, { hideOn: hideTooltip }),
    baseTheme
];
var lintGutterConfig = state.Facet.define({
    combine: function (configs) {
        return state.combineConfig(configs, {
            hoverTime: 300 /* Hover.Time */,
            markerFilter: null,
            tooltipFilter: null
        });
    }
});

function _loadWasmModule (sync, filepath, src, imports) {
  function _instantiateOrCompile(source, imports, stream) {
    var instantiateFunc = stream ? WebAssembly.instantiateStreaming : WebAssembly.instantiate;
    var compileFunc = stream ? WebAssembly.compileStreaming : WebAssembly.compile;

    if (imports) {
      return instantiateFunc(source, imports)
    } else {
      return compileFunc(source)
    }
  }

  
var buf = null;
var isNode = typeof process !== 'undefined' && process.versions != null && process.versions.node != null;

if (isNode) {
  
buf = Buffer.from(src, 'base64');

} else {
  
var raw = globalThis.atob(src);
var rawLength = raw.length;
buf = new Uint8Array(new ArrayBuffer(rawLength));
for(var i = 0; i < rawLength; i++) {
   buf[i] = raw.charCodeAt(i);
}

}


  {
    return _instantiateOrCompile(buf, imports, false)
  }
}


let wasm;

const heap = new Array(128).fill(undefined);

heap.push(undefined, null, true, false);

function getObject(idx) { return heap[idx]; }

let heap_next = heap.length;

function dropObject(idx) {
    if (idx < 132) return;
    heap[idx] = heap_next;
    heap_next = idx;
}

function takeObject(idx) {
    const ret = getObject(idx);
    dropObject(idx);
    return ret;
}

const cachedTextDecoder = (typeof TextDecoder !== 'undefined' ? new TextDecoder('utf-8', { ignoreBOM: true, fatal: true }) : { decode: () => { throw Error('TextDecoder not available') } } );

if (typeof TextDecoder !== 'undefined') { cachedTextDecoder.decode(); }
let cachedUint8Memory0 = null;

function getUint8Memory0() {
    if (cachedUint8Memory0 === null || cachedUint8Memory0.byteLength === 0) {
        cachedUint8Memory0 = new Uint8Array(wasm.memory.buffer);
    }
    return cachedUint8Memory0;
}

function getStringFromWasm0(ptr, len) {
    ptr = ptr >>> 0;
    return cachedTextDecoder.decode(getUint8Memory0().subarray(ptr, ptr + len));
}

function addHeapObject(obj) {
    if (heap_next === heap.length) heap.push(heap.length + 1);
    const idx = heap_next;
    heap_next = heap[idx];

    heap[idx] = obj;
    return idx;
}

/**
* Configure Harper whether to include spell checking in the linting provided
* by the [`lint`] function.
* @param {boolean} set
*/
function use_spell_check(set) {
    wasm.use_spell_check(set);
}

let WASM_VECTOR_LEN = 0;

const cachedTextEncoder = (typeof TextEncoder !== 'undefined' ? new TextEncoder('utf-8') : { encode: () => { throw Error('TextEncoder not available') } } );

const encodeString = (typeof cachedTextEncoder.encodeInto === 'function'
    ? function (arg, view) {
    return cachedTextEncoder.encodeInto(arg, view);
}
    : function (arg, view) {
    const buf = cachedTextEncoder.encode(arg);
    view.set(buf);
    return {
        read: arg.length,
        written: buf.length
    };
});

function passStringToWasm0(arg, malloc, realloc) {

    if (realloc === undefined) {
        const buf = cachedTextEncoder.encode(arg);
        const ptr = malloc(buf.length, 1) >>> 0;
        getUint8Memory0().subarray(ptr, ptr + buf.length).set(buf);
        WASM_VECTOR_LEN = buf.length;
        return ptr;
    }

    let len = arg.length;
    let ptr = malloc(len, 1) >>> 0;

    const mem = getUint8Memory0();

    let offset = 0;

    for (; offset < len; offset++) {
        const code = arg.charCodeAt(offset);
        if (code > 0x7F) break;
        mem[ptr + offset] = code;
    }

    if (offset !== len) {
        if (offset !== 0) {
            arg = arg.slice(offset);
        }
        ptr = realloc(ptr, len, len = offset + arg.length * 3, 1) >>> 0;
        const view = getUint8Memory0().subarray(ptr + offset, ptr + len);
        const ret = encodeString(arg, view);

        offset += ret.written;
        ptr = realloc(ptr, len, offset, 1) >>> 0;
    }

    WASM_VECTOR_LEN = offset;
    return ptr;
}

let cachedInt32Memory0 = null;

function getInt32Memory0() {
    if (cachedInt32Memory0 === null || cachedInt32Memory0.byteLength === 0) {
        cachedInt32Memory0 = new Int32Array(wasm.memory.buffer);
    }
    return cachedInt32Memory0;
}

let cachedUint32Memory0 = null;

function getUint32Memory0() {
    if (cachedUint32Memory0 === null || cachedUint32Memory0.byteLength === 0) {
        cachedUint32Memory0 = new Uint32Array(wasm.memory.buffer);
    }
    return cachedUint32Memory0;
}

function getArrayJsValueFromWasm0(ptr, len) {
    ptr = ptr >>> 0;
    const mem = getUint32Memory0();
    const slice = mem.subarray(ptr / 4, ptr / 4 + len);
    const result = [];
    for (let i = 0; i < slice.length; i++) {
        result.push(takeObject(slice[i]));
    }
    return result;
}
/**
* Perform the configured linting on the provided text.
* @param {string} text
* @returns {(Lint)[]}
*/
function lint(text) {
    try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        const ptr0 = passStringToWasm0(text, wasm.__wbindgen_export_0, wasm.__wbindgen_export_1);
        const len0 = WASM_VECTOR_LEN;
        wasm.lint(retptr, ptr0, len0);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var v2 = getArrayJsValueFromWasm0(r0, r1).slice();
        wasm.__wbindgen_export_2(r0, r1 * 4, 4);
        return v2;
    } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
    }
}

function handleError(f, args) {
    try {
        return f.apply(this, args);
    } catch (e) {
        wasm.__wbindgen_export_3(addHeapObject(e));
    }
}

const LintFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_lint_free(ptr >>> 0));
/**
*/
class Lint {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(Lint.prototype);
        obj.__wbg_ptr = ptr;
        LintFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        LintFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_lint_free(ptr);
    }
    /**
    * Get the content of the source material pointed to by [`Self::span`]
    * @returns {string}
    */
    get_problem_text() {
        let deferred1_0;
        let deferred1_1;
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.lint_get_problem_text(retptr, this.__wbg_ptr);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            deferred1_0 = r0;
            deferred1_1 = r1;
            return getStringFromWasm0(r0, r1);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_export_2(deferred1_0, deferred1_1, 1);
        }
    }
    /**
    * Get a string representing the general category of the lint.
    * @returns {string}
    */
    lint_kind() {
        let deferred1_0;
        let deferred1_1;
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.lint_lint_kind(retptr, this.__wbg_ptr);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            deferred1_0 = r0;
            deferred1_1 = r1;
            return getStringFromWasm0(r0, r1);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_export_2(deferred1_0, deferred1_1, 1);
        }
    }
    /**
    * @returns {number}
    */
    suggestion_count() {
        const ret = wasm.lint_suggestion_count(this.__wbg_ptr);
        return ret >>> 0;
    }
    /**
    * @returns {(Suggestion)[]}
    */
    suggestions() {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.lint_suggestions(retptr, this.__wbg_ptr);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var v1 = getArrayJsValueFromWasm0(r0, r1).slice();
            wasm.__wbindgen_export_2(r0, r1 * 4, 4);
            return v1;
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
    * @returns {Span}
    */
    span() {
        const ret = wasm.lint_span(this.__wbg_ptr);
        return Span.__wrap(ret);
    }
    /**
    * @returns {string}
    */
    message() {
        let deferred1_0;
        let deferred1_1;
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.lint_message(retptr, this.__wbg_ptr);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            deferred1_0 = r0;
            deferred1_1 = r1;
            return getStringFromWasm0(r0, r1);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_export_2(deferred1_0, deferred1_1, 1);
        }
    }
}

const SpanFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_span_free(ptr >>> 0));
/**
*/
class Span {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(Span.prototype);
        obj.__wbg_ptr = ptr;
        SpanFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        SpanFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_span_free(ptr);
    }
    /**
    * @returns {number}
    */
    get start() {
        const ret = wasm.__wbg_get_span_start(this.__wbg_ptr);
        return ret >>> 0;
    }
    /**
    * @param {number} arg0
    */
    set start(arg0) {
        wasm.__wbg_set_span_start(this.__wbg_ptr, arg0);
    }
    /**
    * @returns {number}
    */
    get end() {
        const ret = wasm.__wbg_get_span_end(this.__wbg_ptr);
        return ret >>> 0;
    }
    /**
    * @param {number} arg0
    */
    set end(arg0) {
        wasm.__wbg_set_span_end(this.__wbg_ptr, arg0);
    }
    /**
    * @param {number} start
    * @param {number} end
    * @returns {Span}
    */
    static new(start, end) {
        const ret = wasm.span_new(start, end);
        return Span.__wrap(ret);
    }
}

const SuggestionFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_suggestion_free(ptr >>> 0));
/**
*/
class Suggestion {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(Suggestion.prototype);
        obj.__wbg_ptr = ptr;
        SuggestionFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        SuggestionFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_suggestion_free(ptr);
    }
    /**
    * Get the text that is going to replace error.
    * If [`Self::kind`] is `SuggestionKind::Remove`, this will return an empty
    * string.
    * @returns {string}
    */
    get_replacement_text() {
        let deferred1_0;
        let deferred1_1;
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.suggestion_get_replacement_text(retptr, this.__wbg_ptr);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            deferred1_0 = r0;
            deferred1_1 = r1;
            return getStringFromWasm0(r0, r1);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_export_2(deferred1_0, deferred1_1, 1);
        }
    }
    /**
    * @returns {SuggestionKind}
    */
    kind() {
        const ret = wasm.suggestion_kind(this.__wbg_ptr);
        return ret;
    }
}

async function __wbg_load(module, imports) {
    if (typeof Response === 'function' && module instanceof Response) {
        if (typeof WebAssembly.instantiateStreaming === 'function') {
            try {
                return await WebAssembly.instantiateStreaming(module, imports);

            } catch (e) {
                if (module.headers.get('Content-Type') != 'application/wasm') {
                    console.warn("`WebAssembly.instantiateStreaming` failed because your server does not serve wasm with `application/wasm` MIME type. Falling back to `WebAssembly.instantiate` which is slower. Original error:\n", e);

                } else {
                    throw e;
                }
            }
        }

        const bytes = await module.arrayBuffer();
        return await WebAssembly.instantiate(bytes, imports);

    } else {
        const instance = await WebAssembly.instantiate(module, imports);

        if (instance instanceof WebAssembly.Instance) {
            return { instance, module };

        } else {
            return instance;
        }
    }
}

function __wbg_get_imports() {
    const imports = {};
    imports.wbg = {};
    imports.wbg.__wbg_suggestion_new = function(arg0) {
        const ret = Suggestion.__wrap(arg0);
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_lint_new = function(arg0) {
        const ret = Lint.__wrap(arg0);
        return addHeapObject(ret);
    };
    imports.wbg.__wbindgen_object_drop_ref = function(arg0) {
        takeObject(arg0);
    };
    imports.wbg.__wbindgen_string_new = function(arg0, arg1) {
        const ret = getStringFromWasm0(arg0, arg1);
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_mark_40e050a77cc39fea = function(arg0, arg1) {
        performance.mark(getStringFromWasm0(arg0, arg1));
    };
    imports.wbg.__wbg_log_c9486ca5d8e2cbe8 = function(arg0, arg1) {
        let deferred0_0;
        let deferred0_1;
        try {
            deferred0_0 = arg0;
            deferred0_1 = arg1;
            console.log(getStringFromWasm0(arg0, arg1));
        } finally {
            wasm.__wbindgen_export_2(deferred0_0, deferred0_1, 1);
        }
    };
    imports.wbg.__wbg_log_aba5996d9bde071f = function(arg0, arg1, arg2, arg3, arg4, arg5, arg6, arg7) {
        let deferred0_0;
        let deferred0_1;
        try {
            deferred0_0 = arg0;
            deferred0_1 = arg1;
            console.log(getStringFromWasm0(arg0, arg1), getStringFromWasm0(arg2, arg3), getStringFromWasm0(arg4, arg5), getStringFromWasm0(arg6, arg7));
        } finally {
            wasm.__wbindgen_export_2(deferred0_0, deferred0_1, 1);
        }
    };
    imports.wbg.__wbg_measure_aa7a73f17813f708 = function() { return handleError(function (arg0, arg1, arg2, arg3) {
        let deferred0_0;
        let deferred0_1;
        let deferred1_0;
        let deferred1_1;
        try {
            deferred0_0 = arg0;
            deferred0_1 = arg1;
            deferred1_0 = arg2;
            deferred1_1 = arg3;
            performance.measure(getStringFromWasm0(arg0, arg1), getStringFromWasm0(arg2, arg3));
        } finally {
            wasm.__wbindgen_export_2(deferred0_0, deferred0_1, 1);
            wasm.__wbindgen_export_2(deferred1_0, deferred1_1, 1);
        }
    }, arguments) };
    imports.wbg.__wbg_new_abda76e883ba8a5f = function() {
        const ret = new Error();
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_stack_658279fe44541cf6 = function(arg0, arg1) {
        const ret = getObject(arg1).stack;
        const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_export_0, wasm.__wbindgen_export_1);
        const len1 = WASM_VECTOR_LEN;
        getInt32Memory0()[arg0 / 4 + 1] = len1;
        getInt32Memory0()[arg0 / 4 + 0] = ptr1;
    };
    imports.wbg.__wbg_error_f851667af71bcfc6 = function(arg0, arg1) {
        let deferred0_0;
        let deferred0_1;
        try {
            deferred0_0 = arg0;
            deferred0_1 = arg1;
            console.error(getStringFromWasm0(arg0, arg1));
        } finally {
            wasm.__wbindgen_export_2(deferred0_0, deferred0_1, 1);
        }
    };
    imports.wbg.__wbindgen_throw = function(arg0, arg1) {
        throw new Error(getStringFromWasm0(arg0, arg1));
    };

    return imports;
}

function __wbg_finalize_init(instance, module) {
    wasm = instance.exports;
    __wbg_init.__wbindgen_wasm_module = module;
    cachedInt32Memory0 = null;
    cachedUint32Memory0 = null;
    cachedUint8Memory0 = null;

    wasm.__wbindgen_start();
    return wasm;
}

async function __wbg_init(input) {
    if (wasm !== undefined) return wasm;

    if (typeof input === 'undefined') {
        input = new URL('harper_wasm_bg.wasm', (typeof document === 'undefined' ? require('u' + 'rl').pathToFileURL(__filename).href : (_documentCurrentScript && _documentCurrentScript.src || new URL('main.js', document.baseURI).href)));
    }
    const imports = __wbg_get_imports();

    if (typeof input === 'string' || (typeof Request === 'function' && input instanceof Request) || (typeof URL === 'function' && input instanceof URL)) {
        input = fetch(input);
    }

    const { instance, module } = await __wbg_load(await input, imports);

    return __wbg_finalize_init(instance, module);
}

function suggestionToLabel(sug) {
	if (sug.kind() == 'Remove') {
		return 'Remove';
	} else {
		return `Replace with "${sug.get_replacement_text()}"`;
	}
}

const harperLinter = linter(
	async (view) => {
		const text = view.state.doc.sliceString(-1);

		await __wbg_init(await wasm$1());

		use_spell_check(false);
		const lints = lint(text);

		return lints.map((lint) => {
			let span = lint.span();

			return {
				from: span.start,
				to: span.end,
				severity: 'error',
				title: lint.lint_kind(),
				message: lint.message(),
				actions: lint.suggestions().map((sug) => {
					return {
						name: suggestionToLabel(sug),
						apply: (view) => {
							if (sug === 'Remove') {
								view.dispatch({
									changes: {
										from: span.start,
										to: span.end,
										insert: ''
									}
								});
							} else {
								view.dispatch({
									changes: {
										from: span.start,
										to: span.end,
										insert: sug.get_replacement_text()
									}
								});
							}
						}
					};
				})
			};
		});
	},
	{ delay: -1 }
);

class HarperPlugin extends obsidian.Plugin {
	async onload() {
		this.registerEditorExtension([harperLinter]);
	}
}

module.exports = HarperPlugin;