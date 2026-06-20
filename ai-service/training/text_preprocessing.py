import re

# simple dictionary for ERP domain expansion
ERP_SYNONYMS = {
    "po": "purchase order",
    "p.o": "purchase order",
    "p o": "purchase order",
    "create po": "create purchase order",
    "make po": "create purchase order",
    "item": "product",
    "items": "product",
    "stock": "inventory",
    "inv": "invoice",
    "how to": "how to create"
}

def normalize_text(text: str) -> str:
    # 1. lowercase
    text = text.lower()

    # 2. remove special characters (keep letters and spaces)
    text = re.sub(r"[^a-z0-9\s]", " ", text)

    # 3. remove extra spaces
    text = re.sub(r"\s+", " ", text).strip()

    # 4. expand ERP synonyms
    words = text.split()
    expanded_words = []

    for word in words:
        if word in ERP_SYNONYMS:
            expanded_words.append(ERP_SYNONYMS[word])
        else:
            expanded_words.append(word)

    return " ".join(expanded_words)


# quick test
if __name__ == "__main__":
    samples = [
        "Hw to crete po???",
        "create PO for supplier",
        "show low stock items!!"
    ]

    for s in samples:
        print(s, "=>", normalize_text(s))