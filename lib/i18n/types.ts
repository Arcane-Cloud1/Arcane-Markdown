export type Locale = 'zh' | 'en';

export interface Translations {
  common: {
    title: string;
    description: string;
    export: string;
    import: string;
    back: string;
    save: string;
    delete: string;
    cancel: string;
    confirm: string;
  };
  editor: {
    editTitle: string;
    newTitle: string;
    titleLabel: string;
    titlePlaceholder: string;
    dragPlaceholder: string;
    exportSuccess: string;
    componentLibrary: string;
    defaultContent: {
        welcome: string;
        startEditing: string;
    };
    modules: {
      basics: string;
      lists: string;
      mediaAndStructure: string;
      components: string;
    };
    blocks: {
      paragraph: string;
      heading1: string;
      heading2: string;
      heading3: string;
      quote: string;
      listUl: string;
      listOl: string;
      checklist: string;
      image: string;
      table: string;
      code: string;
      math: string;
      mermaid: string;
      details: string;
      divider: string;
      calloutInfo: string;
      calloutWarning: string;
      calloutSuccess: string;
      calloutError: string;
    };
    placeholders: {
      paragraph: string;
      heading: string;
      quote: string;
      list: string;
      checklist: string;
      detailsSummary: string;
      detailsContent: string;
      image: string;
      imageAlt: string;
      math: string;
      callout: string;
    };
    buttons: {
        addRow: string;
        addCol: string;
        deleteLastCol: string;
    };
    toolbar: {
      bold: string;
      italic: string;
      strike: string;
      quote: string;
      code: string;
      listUl: string;
      listOl: string;
      h1: string;
      h2: string;
      link: string;
      image: string;
    };
    languageSelector: {
      title: string;
      placeholder: string;
      notFound: string;
      use: string;
    };
    mermaid: {
      label: string;
      direction: string;
      directions: {
        td: string;
        lr: string;
      };
      addNode: string;
      addLink: string;
      nodesList: string;
      linksList: string;
      nodeName: string;
      shapes: {
        rect: string;
        round: string;
        diamond: string;
        circle: string;
      };
      source: string;
      target: string;
      linkLabel: string;
      noLinks: string;
      defaults: {
        start: string;
        end: string;
        newNode: string;
      };
    };
    codeInserter: {
      title: string;
      languageLabel: string;
      languagePlaceholder: string;
      codeLabel: string;
      codePlaceholder: string;
      cancel: string;
      insert: string;
      text: string;
    };
    imageInserter: {
      title: string;
      urlLabel: string;
      urlPlaceholder: string;
      altLabel: string;
      altPlaceholder: string;
      cancel: string;
      insert: string;
    };
    linkInserter: {
      title: string;
      urlLabel: string;
      urlPlaceholder: string;
      textLabel: string;
      textPlaceholder: string;
      cancel: string;
      insert: string;
    };
    tableGenerator: {
      titleSize: string;
      titleEdit: string;
      descSize: string;
      descEdit: string;
      rowsLabel: string;
      colsLabel: string;
      header: string;
      content: string;
      cancel: string;
      next: string;
      prev: string;
      finish: string;
    };
  };
}
