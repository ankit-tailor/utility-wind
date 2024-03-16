const { getClassList, getVariantList, getConfig } = require("./load-config");
const fs = require("fs");
const path = require("path");

function getPropertyValue(classname, aliasesMap, value = undefined) {
  const isAlias = aliasesMap.get(classname);
  const splittedClassName = classname.split("-");

  if (!isAlias && splittedClassName.length > 1) {
    const nextAliasCandidate = splittedClassName
      .slice(0, splittedClassName.length - 1)
      .join("-");
    const nextValueCandidate = [
      splittedClassName[splittedClassName.length - 1],
      value,
    ]
      .filter(Boolean)
      .join("-");
    if (nextAliasCandidate) {
      return getPropertyValue(
        nextAliasCandidate,
        aliasesMap,
        nextValueCandidate
      );
    }
  }
  return {
    classname,
    value,
  };
}

function generateTypes() {
  const { context: tailwindUserContext } = getConfig();
  const classList = getClassList(tailwindUserContext);
  const variantList = getVariantList(tailwindUserContext);

  const classListMap = new Map();

  classList.map((classname) => {
    const { classname: aliasedClassNameWithNegativeSymbol, value } =
      getPropertyValue(classname, tailwindUserContext?.candidateRuleMap);

    if (value) {
      let aliasedClassName = aliasedClassNameWithNegativeSymbol;

      if (aliasedClassNameWithNegativeSymbol.startsWith("-")) {
        aliasedClassName = aliasedClassNameWithNegativeSymbol.slice(1);
      }
      const currentClassValue = classListMap.get(aliasedClassName) || [];
      const nextClassValue = [...currentClassValue, value];
      if (aliasedClassNameWithNegativeSymbol.startsWith("-")) {
        nextClassValue.push(`-${value}`);
      }
      classListMap.set(aliasedClassName, nextClassValue);
    } else {
      classListMap.set(classname, []);
    }
  });

  let template = `
    import * as React from "react";
  
    type IUtilityWindBase = {\n`;

  classListMap.forEach((values, key) => {
    const valuesWithQoutes =
      values.length > 0 ? values.map((value) => `'${value}'`) : undefined;

    if (!valuesWithQoutes) {
      template += `  '$${key}'?: true,\n`;
    } else {
      let valueType = valuesWithQoutes.join(" | ");
      template += `  '${key}'?: ${valueType} | (string & {}),\n`;
    }
  });

  template += `}\n`;

  template += `type IUtilityWindVariants = IUtilityWindBase & {\n`;

  variantList.map((variant) => {
    template += `  '${variant}'?: IUtilityWindVariants,\n`;
  });

  template += `}

  type IUtilityWind = IUtilityWindVariants;

  declare module "react" {
    namespace JSX {
      interface IntrinsicElements {
        a: React.DetailedHTMLProps<
          React.AnchorHTMLAttributes<HTMLAnchorElement> &
            Omit<IUtilityWind, keyof HTMLAnchorElement>,
          HTMLAnchorElement
        >;
        abbr: React.DetailedHTMLProps<
          React.HTMLAttributes<HTMLElement> &
            Omit<IUtilityWind, keyof HTMLElement>,
          HTMLElement
        >;
        address: React.DetailedHTMLProps<
          React.HTMLAttributes<HTMLElement> &
            Omit<IUtilityWind, keyof HTMLElement>,
          HTMLElement
        >;
        area: React.DetailedHTMLProps<
          React.AreaHTMLAttributes<HTMLAreaElement> &
            Omit<IUtilityWind, keyof HTMLAreaElement>,
          HTMLAreaElement
        >;
        article: React.DetailedHTMLProps<
          React.HTMLAttributes<HTMLElement> &
            Omit<IUtilityWind, keyof HTMLElement>,
          HTMLElement
        >;
        aside: React.DetailedHTMLProps<
          React.HTMLAttributes<HTMLElement> &
            Omit<IUtilityWind, keyof HTMLElement>,
          HTMLElement
        >;
        audio: React.DetailedHTMLProps<
          React.AudioHTMLAttributes<HTMLAudioElement> &
            Omit<IUtilityWind, keyof HTMLAudioElement>,
          HTMLAudioElement
        >;
        b: React.DetailedHTMLProps<
          React.HTMLAttributes<HTMLElement> &
            Omit<IUtilityWind, keyof HTMLElement>,
          HTMLElement
        >;
        base: React.DetailedHTMLProps<
          React.BaseHTMLAttributes<HTMLBaseElement> &
            Omit<IUtilityWind, keyof HTMLBaseElement>,
          HTMLBaseElement
        >;
        bdi: React.DetailedHTMLProps<
          React.HTMLAttributes<HTMLElement> &
            Omit<IUtilityWind, keyof HTMLElement>,
          HTMLElement
        >;
        bdo: React.DetailedHTMLProps<
          React.HTMLAttributes<HTMLElement> &
            Omit<IUtilityWind, keyof HTMLElement>,
          HTMLElement
        >;
        big: React.DetailedHTMLProps<
          React.HTMLAttributes<HTMLElement> &
            Omit<IUtilityWind, keyof HTMLElement>,
          HTMLElement
        >;
        blockquote: React.DetailedHTMLProps<
          React.BlockquoteHTMLAttributes<HTMLQuoteElement> &
            Omit<IUtilityWind, keyof HTMLQuoteElement>,
          HTMLQuoteElement
        >;
        body: React.DetailedHTMLProps<
          React.HTMLAttributes<HTMLBodyElement> &
            Omit<IUtilityWind, keyof HTMLBodyElement>,
          HTMLBodyElement
        >;
        br: React.DetailedHTMLProps<
          React.HTMLAttributes<HTMLBRElement> &
            Omit<IUtilityWind, keyof HTMLBRElement>,
          HTMLBRElement
        >;
        button: React.DetailedHTMLProps<
          React.ButtonHTMLAttributes<HTMLButtonElement> &
            Omit<IUtilityWind, keyof HTMLButtonElement>,
          HTMLButtonElement
        >;
        canvas: React.DetailedHTMLProps<
          React.CanvasHTMLAttributes<HTMLCanvasElement> &
            Omit<IUtilityWind, keyof HTMLCanvasElement>,
          HTMLCanvasElement
        >;
        caption: React.DetailedHTMLProps<
          React.HTMLAttributes<HTMLElement> &
            Omit<IUtilityWind, keyof HTMLElement>,
          HTMLElement
        >;
        center: React.DetailedHTMLProps<
          React.HTMLAttributes<HTMLElement> &
            Omit<IUtilityWind, keyof HTMLElement>,
          HTMLElement
        >;
        cite: React.DetailedHTMLProps<
          React.HTMLAttributes<HTMLElement> &
            Omit<IUtilityWind, keyof HTMLElement>,
          HTMLElement
        >;
        code: React.DetailedHTMLProps<
          React.HTMLAttributes<HTMLElement> &
            Omit<IUtilityWind, keyof HTMLElement>,
          HTMLElement
        >;
        col: React.DetailedHTMLProps<
          React.ColHTMLAttributes<HTMLTableColElement> &
            Omit<IUtilityWind, keyof HTMLTableColElement>,
          HTMLTableColElement
        >;
        colgroup: React.DetailedHTMLProps<
          React.ColgroupHTMLAttributes<HTMLTableColElement> &
            Omit<IUtilityWind, keyof HTMLTableColElement>,
          HTMLTableColElement
        >;
        data: React.DetailedHTMLProps<
          React.DataHTMLAttributes<HTMLDataElement> &
            Omit<IUtilityWind, keyof HTMLDataElement>,
          HTMLDataElement
        >;
        datalist: React.DetailedHTMLProps<
          React.HTMLAttributes<HTMLDataListElement> &
            Omit<IUtilityWind, keyof HTMLDataListElement>,
          HTMLDataListElement
        >;
        dd: React.DetailedHTMLProps<
          React.HTMLAttributes<HTMLElement> &
            Omit<IUtilityWind, keyof HTMLElement>,
          HTMLElement
        >;
        del: React.DetailedHTMLProps<
          React.DelHTMLAttributes<HTMLModElement> &
            Omit<IUtilityWind, keyof HTMLModElement>,
          HTMLModElement
        >;
        details: React.DetailedHTMLProps<
          React.DetailsHTMLAttributes<HTMLDetailsElement> &
            Omit<IUtilityWind, keyof HTMLDetailsElement>,
          HTMLDetailsElement
        >;
        dfn: React.DetailedHTMLProps<
          React.HTMLAttributes<HTMLElement> &
            Omit<IUtilityWind, keyof HTMLElement>,
          HTMLElement
        >;
        dialog: React.DetailedHTMLProps<
          React.DialogHTMLAttributes<HTMLDialogElement> &
            Omit<IUtilityWind, keyof HTMLDialogElement>,
          HTMLDialogElement
        >;
        div: React.DetailedHTMLProps<
          React.HTMLAttributes<HTMLDivElement> &
            Omit<IUtilityWind, keyof HTMLDivElement>,
          HTMLDivElement
        >;
        dl: React.DetailedHTMLProps<
          React.HTMLAttributes<HTMLDListElement> &
            Omit<IUtilityWind, keyof HTMLDListElement>,
          HTMLDListElement
        >;
        dt: React.DetailedHTMLProps<
          React.HTMLAttributes<HTMLElement> &
            Omit<IUtilityWind, keyof HTMLElement>,
          HTMLElement
        >;
        em: React.DetailedHTMLProps<
          React.HTMLAttributes<HTMLElement> &
            Omit<IUtilityWind, keyof HTMLElement>,
          HTMLElement
        >;
        embed: React.DetailedHTMLProps<
          React.EmbedHTMLAttributes<HTMLEmbedElement> &
            Omit<IUtilityWind, keyof HTMLEmbedElement>,
          HTMLEmbedElement
        >;
        fieldset: React.DetailedHTMLProps<
          React.FieldsetHTMLAttributes<HTMLFieldSetElement> &
            Omit<IUtilityWind, keyof HTMLFieldSetElement>,
          HTMLFieldSetElement
        >;
        figcaption: React.DetailedHTMLProps<
          React.HTMLAttributes<HTMLElement> &
            Omit<IUtilityWind, keyof HTMLElement>,
          HTMLElement
        >;
        figure: React.DetailedHTMLProps<
          React.HTMLAttributes<HTMLElement> &
            Omit<IUtilityWind, keyof HTMLElement>,
          HTMLElement
        >;
        footer: React.DetailedHTMLProps<
          React.HTMLAttributes<HTMLElement> &
            Omit<IUtilityWind, keyof HTMLElement>,
          HTMLElement
        >;
        form: React.DetailedHTMLProps<
          React.FormHTMLAttributes<HTMLFormElement> &
            Omit<IUtilityWind, keyof HTMLFormElement>,
          HTMLFormElement
        >;
        h1: React.DetailedHTMLProps<
          React.HTMLAttributes<HTMLHeadingElement> &
            Omit<IUtilityWind, keyof HTMLHeadingElement>,
          HTMLHeadingElement
        >;
        h2: React.DetailedHTMLProps<
          React.HTMLAttributes<HTMLHeadingElement> &
            Omit<IUtilityWind, keyof HTMLHeadingElement>,
          HTMLHeadingElement
        >;
        h3: React.DetailedHTMLProps<
          React.HTMLAttributes<HTMLHeadingElement> &
            Omit<IUtilityWind, keyof HTMLHeadingElement>,
          HTMLHeadingElement
        >;
        h4: React.DetailedHTMLProps<
          React.HTMLAttributes<HTMLHeadingElement> &
            Omit<IUtilityWind, keyof HTMLHeadingElement>,
          HTMLHeadingElement
        >;
        h5: React.DetailedHTMLProps<
          React.HTMLAttributes<HTMLHeadingElement> &
            Omit<IUtilityWind, keyof HTMLHeadingElement>,
          HTMLHeadingElement
        >;
        h6: React.DetailedHTMLProps<
          React.HTMLAttributes<HTMLHeadingElement> &
            Omit<IUtilityWind, keyof HTMLHeadingElement>,
          HTMLHeadingElement
        >;
        head: React.DetailedHTMLProps<
          React.HTMLAttributes<HTMLHeadElement> &
            Omit<IUtilityWind, keyof HTMLHeadElement>,
          HTMLHeadElement
        >;
        header: React.DetailedHTMLProps<
          React.HTMLAttributes<HTMLElement> &
            Omit<IUtilityWind, keyof HTMLElement>,
          HTMLElement
        >;
        hgroup: React.DetailedHTMLProps<
          React.HTMLAttributes<HTMLElement> &
            Omit<IUtilityWind, keyof HTMLElement>,
          HTMLElement
        >;
        hr: React.DetailedHTMLProps<
          React.HTMLAttributes<HTMLHRElement> &
            Omit<IUtilityWind, keyof HTMLHRElement>,
          HTMLHRElement
        >;
        html: React.DetailedHTMLProps<
          React.HtmlHTMLAttributes<HTMLHtmlElement> &
            Omit<IUtilityWind, keyof HTMLHtmlElement>,
          HTMLHtmlElement
        >;
        i: React.DetailedHTMLProps<
          React.HTMLAttributes<HTMLElement> &
            Omit<IUtilityWind, keyof HTMLElement>,
          HTMLElement
        >;
        iframe: React.DetailedHTMLProps<
          React.IframeHTMLAttributes<HTMLIFrameElement> &
            Omit<IUtilityWind, keyof HTMLIFrameElement>,
          HTMLIFrameElement
        >;
        img: React.DetailedHTMLProps<
          React.ImgHTMLAttributes<HTMLImageElement> &
            Omit<IUtilityWind, keyof HTMLImageElement>,
          HTMLImageElement
        >;
        input: React.DetailedHTMLProps<
          React.InputHTMLAttributes<HTMLInputElement> &
            Omit<IUtilityWind, keyof HTMLInputElement>,
          HTMLInputElement
        >;
        ins: React.DetailedHTMLProps<
          React.InsHTMLAttributes<HTMLModElement> &
            Omit<IUtilityWind, keyof HTMLModElement>,
          HTMLModElement
        >;
        kbd: React.DetailedHTMLProps<
          React.HTMLAttributes<HTMLElement> &
            Omit<IUtilityWind, keyof HTMLElement>,
          HTMLElement
        >;
        keygen: React.DetailedHTMLProps<
          React.KeygenHTMLAttributes<HTMLElement> &
            Omit<IUtilityWind, keyof HTMLElement>,
          HTMLElement
        >;
        label: React.DetailedHTMLProps<
          React.LabelHTMLAttributes<HTMLLabelElement> &
            Omit<IUtilityWind, keyof HTMLLabelElement>,
          HTMLLabelElement
        >;
        legend: React.DetailedHTMLProps<
          React.HTMLAttributes<HTMLLegendElement> &
            Omit<IUtilityWind, keyof HTMLLegendElement>,
          HTMLLegendElement
        >;
        li: React.DetailedHTMLProps<
          React.LiHTMLAttributes<HTMLLIElement> &
            Omit<IUtilityWind, keyof HTMLLIElement>,
          HTMLLIElement
        >;
        link: React.DetailedHTMLProps<
          React.LinkHTMLAttributes<HTMLLinkElement> &
            Omit<IUtilityWind, keyof HTMLLinkElement>,
          HTMLLinkElement
        >;
        main: React.DetailedHTMLProps<
          React.HTMLAttributes<HTMLElement> &
            Omit<IUtilityWind, keyof HTMLElement>,
          HTMLElement
        >;
        map: React.DetailedHTMLProps<
          React.MapHTMLAttributes<HTMLMapElement> &
            Omit<IUtilityWind, keyof HTMLMapElement>,
          HTMLMapElement
        >;
        mark: React.DetailedHTMLProps<
          React.HTMLAttributes<HTMLElement> &
            Omit<IUtilityWind, keyof HTMLElement>,
          HTMLElement
        >;
        menu: React.DetailedHTMLProps<
          React.MenuHTMLAttributes<HTMLElement> &
            Omit<IUtilityWind, keyof HTMLElement>,
          HTMLElement
        >;
        menuitem: React.DetailedHTMLProps<
          React.HTMLAttributes<HTMLElement> &
            Omit<IUtilityWind, keyof HTMLElement>,
          HTMLElement
        >;
        meta: React.DetailedHTMLProps<
          React.MetaHTMLAttributes<HTMLMetaElement> &
            Omit<IUtilityWind, keyof HTMLMetaElement>,
          HTMLMetaElement
        >;
        meter: React.DetailedHTMLProps<
          React.MeterHTMLAttributes<HTMLMeterElement> &
            Omit<IUtilityWind, keyof HTMLMeterElement>,
          HTMLMeterElement
        >;
        nav: React.DetailedHTMLProps<
          React.HTMLAttributes<HTMLElement> &
            Omit<IUtilityWind, keyof HTMLElement>,
          HTMLElement
        >;
        noindex: React.DetailedHTMLProps<
          React.HTMLAttributes<HTMLElement> &
            Omit<IUtilityWind, keyof HTMLElement>,
          HTMLElement
        >;
        noscript: React.DetailedHTMLProps<
          React.HTMLAttributes<HTMLElement> &
            Omit<IUtilityWind, keyof HTMLElement>,
          HTMLElement
        >;
        object: React.DetailedHTMLProps<
          React.ObjectHTMLAttributes<HTMLObjectElement> &
            Omit<IUtilityWind, keyof HTMLObjectElement>,
          HTMLObjectElement
        >;
        ol: React.DetailedHTMLProps<
          React.OlHTMLAttributes<HTMLOListElement> &
            Omit<IUtilityWind, keyof HTMLOListElement>,
          HTMLOListElement
        >;
        optgroup: React.DetailedHTMLProps<
          React.OptgroupHTMLAttributes<HTMLOptGroupElement> &
            Omit<IUtilityWind, keyof HTMLOptGroupElement>,
          HTMLOptGroupElement
        >;
        option: React.DetailedHTMLProps<
          React.OptionHTMLAttributes<HTMLOptionElement> &
            Omit<IUtilityWind, keyof HTMLOptionElement>,
          HTMLOptionElement
        >;
        output: React.DetailedHTMLProps<
          React.OutputHTMLAttributes<HTMLOutputElement> &
            Omit<IUtilityWind, keyof HTMLOutputElement>,
          HTMLOutputElement
        >;
        p: React.DetailedHTMLProps<
          React.HTMLAttributes<HTMLParagraphElement> &
            Omit<IUtilityWind, keyof HTMLParagraphElement>,
          HTMLParagraphElement
        >;
        param: React.DetailedHTMLProps<
          React.ParamHTMLAttributes<HTMLParamElement> &
            Omit<IUtilityWind, keyof HTMLParamElement>,
          HTMLParamElement
        >;
        picture: React.DetailedHTMLProps<
          React.HTMLAttributes<HTMLElement> &
            Omit<IUtilityWind, keyof HTMLElement>,
          HTMLElement
        >;
        pre: React.DetailedHTMLProps<
          React.HTMLAttributes<HTMLPreElement> &
            Omit<IUtilityWind, keyof HTMLPreElement>,
          HTMLPreElement
        >;
        progress: React.DetailedHTMLProps<
          React.ProgressHTMLAttributes<HTMLProgressElement> &
            Omit<IUtilityWind, keyof HTMLProgressElement>,
          HTMLProgressElement
        >;
        q: React.DetailedHTMLProps<
          React.QuoteHTMLAttributes<HTMLQuoteElement> &
            Omit<IUtilityWind, keyof HTMLQuoteElement>,
          HTMLQuoteElement
        >;
        rp: React.DetailedHTMLProps<
          React.HTMLAttributes<HTMLElement> &
            Omit<IUtilityWind, keyof HTMLElement>,
          HTMLElement
        >;
        rt: React.DetailedHTMLProps<
          React.HTMLAttributes<HTMLElement> &
            Omit<IUtilityWind, keyof HTMLElement>,
          HTMLElement
        >;
        ruby: React.DetailedHTMLProps<
          React.HTMLAttributes<HTMLElement> &
            Omit<IUtilityWind, keyof HTMLElement>,
          HTMLElement
        >;
        s: React.DetailedHTMLProps<
          React.HTMLAttributes<HTMLElement> &
            Omit<IUtilityWind, keyof HTMLElement>,
          HTMLElement
        >;
        samp: React.DetailedHTMLProps<
          React.HTMLAttributes<HTMLElement> &
            Omit<IUtilityWind, keyof HTMLElement>,
          HTMLElement
        >;
        search: React.DetailedHTMLProps<
          React.HTMLAttributes<HTMLElement> &
            Omit<IUtilityWind, keyof HTMLElement>,
          HTMLElement
        >;
        slot: React.DetailedHTMLProps<
          React.SlotHTMLAttributes<HTMLSlotElement> &
            Omit<IUtilityWind, keyof HTMLSlotElement>,
          HTMLSlotElement
        >;
        script: React.DetailedHTMLProps<
          React.ScriptHTMLAttributes<HTMLScriptElement> &
            Omit<IUtilityWind, keyof HTMLScriptElement>,
          HTMLScriptElement
        >;
        section: React.DetailedHTMLProps<
          React.HTMLAttributes<HTMLElement> &
            Omit<IUtilityWind, keyof HTMLElement>,
          HTMLElement
        >;
        select: React.DetailedHTMLProps<
          React.SelectHTMLAttributes<HTMLSelectElement> &
            Omit<IUtilityWind, keyof HTMLSelectElement>,
          HTMLSelectElement
        >;
        small: React.DetailedHTMLProps<
          React.HTMLAttributes<HTMLElement> &
            Omit<IUtilityWind, keyof HTMLElement>,
          HTMLElement
        >;
        source: React.DetailedHTMLProps<
          React.SourceHTMLAttributes<HTMLSourceElement> &
            Omit<IUtilityWind, keyof HTMLSourceElement>,
          HTMLSourceElement
        >;
        span: React.DetailedHTMLProps<
          React.HTMLAttributes<HTMLSpanElement> &
            Omit<IUtilityWind, keyof HTMLSpanElement>,
          HTMLSpanElement
        >;
        strong: React.DetailedHTMLProps<
          React.HTMLAttributes<HTMLElement> &
            Omit<IUtilityWind, keyof HTMLElement>,
          HTMLElement
        >;
        style: React.DetailedHTMLProps<
          React.StyleHTMLAttributes<HTMLStyleElement> &
            Omit<IUtilityWind, keyof HTMLStyleElement>,
          HTMLStyleElement
        >;
        sub: React.DetailedHTMLProps<
          React.HTMLAttributes<HTMLElement> &
            Omit<IUtilityWind, keyof HTMLElement>,
          HTMLElement
        >;
        summary: React.DetailedHTMLProps<
          React.HTMLAttributes<HTMLElement> &
            Omit<IUtilityWind, keyof HTMLElement>,
          HTMLElement
        >;
        sup: React.DetailedHTMLProps<
          React.HTMLAttributes<HTMLElement> &
            Omit<IUtilityWind, keyof HTMLElement>,
          HTMLElement
        >;
        table: React.DetailedHTMLProps<
          React.TableHTMLAttributes<HTMLTableElement> &
            Omit<IUtilityWind, keyof HTMLTableElement>,
          HTMLTableElement
        >;
        template: React.DetailedHTMLProps<
          React.HTMLAttributes<HTMLTemplateElement> &
            Omit<IUtilityWind, keyof HTMLTemplateElement>,
          HTMLTemplateElement
        >;
        tbody: React.DetailedHTMLProps<
          React.HTMLAttributes<HTMLTableSectionElement> &
            Omit<IUtilityWind, keyof HTMLTableSectionElement>,
          HTMLTableSectionElement
        >;
        td: React.DetailedHTMLProps<
          React.TdHTMLAttributes<HTMLTableDataCellElement> &
            Omit<IUtilityWind, keyof HTMLTableDataCellElement>,
          HTMLTableDataCellElement
        >;
        textarea: React.DetailedHTMLProps<
          React.TextareaHTMLAttributes<HTMLTextAreaElement> &
            Omit<IUtilityWind, keyof HTMLTextAreaElement>,
          HTMLTextAreaElement
        >;
        tfoot: React.DetailedHTMLProps<
          React.HTMLAttributes<HTMLTableSectionElement> &
            Omit<IUtilityWind, keyof HTMLTableSectionElement>,
          HTMLTableSectionElement
        >;
        th: React.DetailedHTMLProps<
          React.ThHTMLAttributes<HTMLTableHeaderCellElement> &
            Omit<IUtilityWind, keyof HTMLTableHeaderCellElement>,
          HTMLTableHeaderCellElement
        >;
        thead: React.DetailedHTMLProps<
          React.HTMLAttributes<HTMLTableSectionElement> &
            Omit<IUtilityWind, keyof HTMLTableSectionElement>,
          HTMLTableSectionElement
        >;
        time: React.DetailedHTMLProps<
          React.TimeHTMLAttributes<HTMLTimeElement> &
            Omit<IUtilityWind, keyof HTMLTimeElement>,
          HTMLTimeElement
        >;
        title: React.DetailedHTMLProps<
          React.HTMLAttributes<HTMLTitleElement> &
            Omit<IUtilityWind, keyof HTMLTitleElement>,
          HTMLTitleElement
        >;
        tr: React.DetailedHTMLProps<
          React.HTMLAttributes<HTMLTableRowElement> &
            Omit<IUtilityWind, keyof HTMLTableRowElement>,
          HTMLTableRowElement
        >;
        track: React.DetailedHTMLProps<
          React.TrackHTMLAttributes<HTMLTrackElement> &
            Omit<IUtilityWind, keyof HTMLTrackElement>,
          HTMLTrackElement
        >;
        u: React.DetailedHTMLProps<
          React.HTMLAttributes<HTMLElement> &
            Omit<IUtilityWind, keyof HTMLElement>,
          HTMLElement
        >;
        ul: React.DetailedHTMLProps<
          React.HTMLAttributes<HTMLUListElement> &
            Omit<IUtilityWind, keyof HTMLUListElement>,
          HTMLUListElement
        >;
        var: React.DetailedHTMLProps<
          React.HTMLAttributes<HTMLElement> &
            Omit<IUtilityWind, keyof HTMLElement>,
          HTMLElement
        >;
        video: React.DetailedHTMLProps<
          React.VideoHTMLAttributes<HTMLVideoElement> &
            Omit<IUtilityWind, keyof HTMLVideoElement>,
          HTMLVideoElement
        >;
        wbr: React.DetailedHTMLProps<
          React.HTMLAttributes<HTMLElement> &
            Omit<IUtilityWind, keyof HTMLElement>,
          HTMLElement
        >;
        webview: React.DetailedHTMLProps<
          React.WebViewHTMLAttributes<HTMLWebViewElement> &
            Omit<IUtilityWind, keyof HTMLWebViewElement>,
          HTMLWebViewElement
        >;
  
        // SVG
        svg: React.SVGProps<SVGSVGElement> &
          Omit<IUtilityWind, keyof SVGSVGElement>;
  
        animate: React.SVGProps<SVGElement> &
          Omit<IUtilityWind, keyof SVGElement>;
        animateMotion: React.SVGProps<SVGElement> &
          Omit<IUtilityWind, keyof SVGElement>;
        animateTransform: React.SVGProps<SVGElement> &
          Omit<IUtilityWind, keyof SVGElement>;
        circle: React.SVGProps<SVGCircleElement> &
          Omit<IUtilityWind, keyof SVGCircleElement>;
        clipPath: React.SVGProps<SVGClipPathElement> &
          Omit<IUtilityWind, keyof SVGClipPathElement>;
        defs: React.SVGProps<SVGDefsElement> &
          Omit<IUtilityWind, keyof SVGDefsElement>;
        desc: React.SVGProps<SVGDescElement> &
          Omit<IUtilityWind, keyof SVGDescElement>;
        ellipse: React.SVGProps<SVGEllipseElement> &
          Omit<IUtilityWind, keyof SVGEllipseElement>;
        feBlend: React.SVGProps<SVGFEBlendElement> &
          Omit<IUtilityWind, keyof SVGFEBlendElement>;
        feColorMatrix: React.SVGProps<SVGFEColorMatrixElement> &
          Omit<IUtilityWind, keyof SVGFEColorMatrixElement>;
        feComponentTransfer: React.SVGProps<SVGFEComponentTransferElement> &
          Omit<IUtilityWind, keyof SVGFEComponentTransferElement>;
        feComposite: React.SVGProps<SVGFECompositeElement> &
          Omit<IUtilityWind, keyof SVGFECompositeElement>;
        feConvolveMatrix: React.SVGProps<SVGFEConvolveMatrixElement> &
          Omit<IUtilityWind, keyof SVGFEConvolveMatrixElement>;
        feDiffuseLighting: React.SVGProps<SVGFEDiffuseLightingElement> &
          Omit<IUtilityWind, keyof SVGFEDiffuseLightingElement>;
        feDisplacementMap: React.SVGProps<SVGFEDisplacementMapElement> &
          Omit<IUtilityWind, keyof SVGFEDisplacementMapElement>;
        feDistantLight: React.SVGProps<SVGFEDistantLightElement> &
          Omit<IUtilityWind, keyof SVGFEDistantLightElement>;
        feDropShadow: React.SVGProps<SVGFEDropShadowElement> &
          Omit<IUtilityWind, keyof SVGFEDropShadowElement>;
        feFlood: React.SVGProps<SVGFEFloodElement> &
          Omit<IUtilityWind, keyof SVGFEFloodElement>;
        feFuncA: React.SVGProps<SVGFEFuncAElement> &
          Omit<IUtilityWind, keyof SVGFEFuncAElement>;
        feFuncB: React.SVGProps<SVGFEFuncBElement> &
          Omit<IUtilityWind, keyof SVGFEFuncBElement>;
        feFuncG: React.SVGProps<SVGFEFuncGElement> &
          Omit<IUtilityWind, keyof SVGFEFuncGElement>;
        feFuncR: React.SVGProps<SVGFEFuncRElement> &
          Omit<IUtilityWind, keyof SVGFEFuncRElement>;
        feGaussianBlur: React.SVGProps<SVGFEGaussianBlurElement> &
          Omit<IUtilityWind, keyof SVGFEGaussianBlurElement>;
        feImage: React.SVGProps<SVGFEImageElement> &
          Omit<IUtilityWind, keyof SVGFEImageElement>;
        feMerge: React.SVGProps<SVGFEMergeElement> &
          Omit<IUtilityWind, keyof SVGFEMergeElement>;
        feMergeNode: React.SVGProps<SVGFEMergeNodeElement> &
          Omit<IUtilityWind, keyof SVGFEMergeNodeElement>;
        feMorphology: React.SVGProps<SVGFEMorphologyElement> &
          Omit<IUtilityWind, keyof SVGFEMorphologyElement>;
        feOffset: React.SVGProps<SVGFEOffsetElement> &
          Omit<IUtilityWind, keyof SVGFEOffsetElement>;
        fePointLight: React.SVGProps<SVGFEPointLightElement> &
          Omit<IUtilityWind, keyof SVGFEPointLightElement>;
        feSpecularLighting: React.SVGProps<SVGFESpecularLightingElement> &
          Omit<IUtilityWind, keyof SVGFESpecularLightingElement>;
        feSpotLight: React.SVGProps<SVGFESpotLightElement> &
          Omit<IUtilityWind, keyof SVGFESpotLightElement>;
        feTile: React.SVGProps<SVGFETileElement> &
          Omit<IUtilityWind, keyof SVGFETileElement>;
        feTurbulence: React.SVGProps<SVGFETurbulenceElement> &
          Omit<IUtilityWind, keyof SVGFETurbulenceElement>;
        filter: React.SVGProps<SVGFilterElement> &
          Omit<IUtilityWind, keyof SVGFilterElement>;
        foreignObject: React.SVGProps<SVGForeignObjectElement> &
          Omit<IUtilityWind, keyof SVGForeignObjectElement>;
        g: React.SVGProps<SVGGElement> & Omit<IUtilityWind, keyof HTMLDivElement>;
        image: React.SVGProps<SVGGElementSVGImageElement> &
          Omit<IUtilityWind, keyof SVGImageElement>;
        line: React.SVGLineElementAttributes<SVGLineElement>;
        linearGradient: React.SVGProps<SVGLinearGradientElement> &
          Omit<IUtilityWind, keyof SVGLinearGradientElement>;
        marker: React.SVGProps<SVGMarkerElement> &
          Omit<IUtilityWind, keyof SVGMarkerElement>;
        mask: React.SVGProps<SVGMaskElement> &
          Omit<IUtilityWind, keyof SVGMaskElement>;
        metadata: React.SVGProps<SVGMetadataElement> &
          Omit<IUtilityWind, keyof SVGMetadataElement>;
        mpath: React.SVGProps<SVGElement> &
          Omit<IUtilityWind, keyof SVGElement>;
        path: React.SVGProps<SVGPathElement> &
          Omit<IUtilityWind, keyof SVGPathElement>;
        pattern: React.SVGProps<SVGPatternElement> &
          Omit<IUtilityWind, keyof SVGPatternElement>;
        polygon: React.SVGProps<SVGPolygonElement> &
          Omit<IUtilityWind, keyof SVGPolygonElement>;
        polyline: React.SVGProps<SVGPolylineElement> &
          Omit<IUtilityWind, keyof SVGPolylineElement>;
        radialGradient: React.SVGProps<SVGRadialGradientElement> &
          Omit<IUtilityWind, keyof SVGRadialGradientElement>;
        rect: React.SVGProps<SVGRectElement> &
          Omit<IUtilityWind, keyof SVGRectElement>;
        set: React.SVGProps<SVGSetElement> &
          Omit<IUtilityWind, keyof SVGSetElement>;
        stop: React.SVGProps<SVGStopElement> &
          Omit<IUtilityWind, keyof SVGStopElement>;
        switch: React.SVGProps<SVGSwitchElement> &
          Omit<IUtilityWind, keyof SVGSwitchElement>;
        symbol: React.SVGProps<SVGSymbolElement> &
          Omit<IUtilityWind, keyof SVGSymbolElement>;
        text: React.SVGTextElementAttributes<SVGTextElement>;
        textPath: React.SVGProps<SVGTextPathElement> &
          Omit<IUtilityWind, keyof SVGTextPathElement>;
        tspan: React.SVGProps<SVGTSpanElement> &
          Omit<IUtilityWind, keyof SVGTSpanElement>;
        use: React.SVGProps<SVGUseElement> &
          Omit<IUtilityWind, keyof SVGUseElement>;
        view: React.SVGProps<SVGViewElement> &
          Omit<IUtilityWind, keyof SVGViewElement>;
      }
    }
  }  
    `;

  fs.writeFileSync(path.join(process.cwd(), "./utility-wind.d.ts"), template, {
    encoding: "utf-8",
  });
}

module.exports = {
  generateTypes,
};
