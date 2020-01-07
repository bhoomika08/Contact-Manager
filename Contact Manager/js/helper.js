const Helper = {
  createDiv: (attr = {}, data = {}) => {
    let $div = $("<div>", attr);
    Object.keys(data).map(key => $div.attr(`data-${key}`, data[key]));
    return $div;
  },

  createAnchorTag: (attr = {}, data = {}, click = function() {}, functionParams) => {
    let $anchor = $("<a>", attr);
    Object.keys(data).map(key => $anchor.attr(`data-${key}`, data[key]));
    $anchor.on("click", () => click(functionParams));
    return $anchor;
  },
};
