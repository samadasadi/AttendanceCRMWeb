function sparkline(svg, entries, options) {


    function getY(max, height, diff, value) {
        return parseFloat((height - (value * height / max) + diff).toFixed(2));
    }

    function defaultFetch(entry) {
        return entry.value;
    }

    function buildElement(tag, attrs) {
        const element = document.createElementNS("http://www.w3.org/2000/svg", tag);

        for (let name in attrs) {
            element.setAttribute(name, attrs[name]);
        }

        return element;
    }


    if (entries.length <= 1) {
        return;
    }

    options = options || {};

    const onmousemove = options.onmousemove;
    const onmouseout = options.onmouseout;


    const spotRadius = options.spotRadius || 2;
    const spotDiameter = spotRadius * 2;
    const cursorWidth = options.cursorWidth || 2;
    const strokeWidth = parseFloat(svg.attributes["stroke-width"].value);
    const width = parseFloat(svg.attributes.width.value) - spotDiameter * 2;
    const fullHeight = parseFloat(svg.attributes.height.value);
    const height = fullHeight - (strokeWidth * 2) - spotDiameter;

    const fetch = options.fetch || defaultFetch;
    const values = entries.map(function (entry) { return fetch(entry) });
    const max = Math.max.apply(Math, values);

    const offscreen = -1000;
    const lastItemIndex = values.length - 1;
    const offset = width / lastItemIndex;

    const datapoints = [];
    const pathY = getY(max, height, strokeWidth + spotRadius, values[0]);
    let pathCoords = 'M' + spotDiameter + ' ' + pathY;

    for (var index = 0; index <= values.length - 1; index++) {
        const value = values[index]
        const x = index * offset + spotDiameter;
        const y = getY(max, height, strokeWidth + spotRadius, value);

        datapoints.push(Object.assign({}, entries[index], {
            index: index,
            x: x,
            y: y
        }));

        pathCoords += ' L ' + x + ' ' + y;
    }

    const path = buildElement("path", {
        'class': "sparkline--line",
        d: pathCoords,
        fill: "none"
    });

    let fillCoords = pathCoords + ' V ' + fullHeight + ' L ' + spotDiameter + ' ' + fullHeight + ' Z';

    const fill = buildElement("path", {
        'class': "sparkline--fill",
        d: fillCoords,
        stroke: "none"
    });

    svg.appendChild(fill);
    svg.appendChild(path);


    const cursor = buildElement("line", {
        'class': "sparkline--cursor",
        x1: offscreen,
        x2: offscreen,
        y1: 0,
        y2: fullHeight,
        "stroke-width": cursorWidth
    });

    const spot = buildElement("circle", {
        'class': "sparkline--spot",
        cx: offscreen,
        cy: offscreen,
        r: spotRadius
    });

    svg.appendChild(cursor);
    svg.appendChild(spot);

    const interactionLayer = buildElement("rect", {
        width: svg.attributes.width.value,
        height: svg.attributes.height.value,
        style: "fill: transparent; stroke: transparent",
        'class': "sparkline--interaction-layer",
    });
    svg.appendChild(interactionLayer);

    interactionLayer.addEventListener("mouseout", function (event) {
        cursor.setAttribute("x1", offscreen);
        cursor.setAttribute("x2", offscreen);

        spot.setAttribute("cx", offscreen);

        if (onmouseout) {
            onmouseout(event);
        }
    });

    interactionLayer.addEventListener("mousemove", function (event) {
        const mouseX = event.offsetX;

        let nextDataPoint = datapoints.find(function (entry) {////////
            return entry.x >= mouseX;
        });

        if (!nextDataPoint) {
            nextDataPoint = datapoints[lastItemIndex];
        }

        let previousDataPoint = datapoints[datapoints.indexOf(nextDataPoint) - 1];
        let currentDataPoint;
        let halfway;

        if (previousDataPoint) {
            halfway = previousDataPoint.x + ((nextDataPoint.x - previousDataPoint.x) / 2);
            currentDataPoint = mouseX >= halfway ? nextDataPoint : previousDataPoint;
        } else {
            currentDataPoint = nextDataPoint;
        }

        const x = currentDataPoint.x;
        const y = currentDataPoint.y;

        spot.setAttribute("cx", x);
        spot.setAttribute("cy", y);

        cursor.setAttribute("x1", x);
        cursor.setAttribute("x2", x);

        if (onmousemove) {
            onmousemove(event, currentDataPoint);
        }
    });
}
