# Төслүүд хуудас — Админ гарын авлага

## Site Page ID

Admin системд шинэ site page үүсгэхдээ дараах ID ашиглана:

```
projects-page
```

---

## Sections бүтэц

### `header` — Хуудасны гарчиг

| Талбар | Төрөл | Тайлбар | Жишээ |
|--------|-------|---------|-------|
| `badge` | string | Жижиг тэмдэглэгээ | `"Манай бүтээлүүд"` |
| `titleLine1` | string | Гарчгийн эхний хэсэг | `"Компанийн"` |
| `titleAccent` | string | Өнгөлөг хэсэг (ногоон өнгөтэй) | `"Төслүүд"` |
| `intro` | string | Танилцуулга текст | `"FoodCity-н хэрэгжүүлсэн..."` |

**JSON жишээ:**
```json
{
  "header": {
    "badge": "Манай бүтээлүүд",
    "titleLine1": "Компанийн",
    "titleAccent": "Төслүүд",
    "intro": "FoodCity-н хэрэгжүүлсэн төслүүдтэй танилцана уу. Картыг дарж дэлгэрэнгүй зурагнуудыг үзнэ үү."
  }
}
```

---

### `items` — Төслийн жагсаалт (массив)

Төсөл бүр дараах талбаруудтай:

| Талбар | Төрөл | Шаардлага | Тайлбар |
|--------|-------|-----------|---------|
| `id` | number | Заавал | Давтагдашгүй дугаар (1, 2, 3…) |
| `name` | string | Заавал | Төслийн нэр |
| `coverImage` | string | Заавал | Картанд харагдах үндсэн зураг |
| `images` | string[] | Заавал | Modal-д харагдах зургуудын жагсаалт |
| `description` | string | Заавалгүй | Товч тайлбар |
| `category` | string | Заавалгүй | Ангилал (жишээ: "Барилга", "Оффис") |

> **Анхаар:** `coverImage` болон `images` талбарт зургийн URL эсвэл `/upload/...` замыг бичнэ.  
> `images` хоосон массив байвал `coverImage` автоматаар ашиглагдана.

**JSON жишээ:**
```json
{
  "items": [
    {
      "id": 1,
      "name": "FoodCity ТТ Цамхаг",
      "coverImage": "/upload/projects/tt-tower-cover.jpg",
      "images": [
        "/upload/projects/tt-tower-1.jpg",
        "/upload/projects/tt-tower-2.jpg",
        "/upload/projects/tt-tower-3.jpg"
      ],
      "description": "Улаанбаатарын төвд баригдсан 12 давхар арилжааны цамхаг.",
      "category": "Арилжааны барилга"
    },
    {
      "id": 2,
      "name": "Инновацийн Парк",
      "coverImage": "/upload/projects/innovation-park-cover.jpg",
      "images": [
        "/upload/projects/innovation-park-1.jpg",
        "/upload/projects/innovation-park-2.jpg"
      ],
      "description": "Технологийн компаниудад зориулсан олон зориулалттай цогцолбор.",
      "category": "Оффис цогцолбор"
    }
  ]
}
```

---

## Бүтэн sections JSON жишээ

```json
{
  "header": {
    "badge": "Манай бүтээлүүд",
    "titleLine1": "Компанийн",
    "titleAccent": "Төслүүд",
    "intro": "FoodCity-н хэрэгжүүлсэн төслүүдтэй танилцана уу. Картыг дарж дэлгэрэнгүй зурагнуудыг үзнэ үү."
  },
  "items": [
    {
      "id": 1,
      "name": "Төслийн нэр",
      "coverImage": "/upload/projects/cover.jpg",
      "images": [
        "/upload/projects/img1.jpg",
        "/upload/projects/img2.jpg"
      ],
      "description": "Төслийн тайлбар",
      "category": "Ангилал"
    }
  ]
}
```

---

## Хуудасны URL

```
https://тансайт.mn/projects
```

## Хэл (lang)

Admin системд **mn** болон **en** хэлний sections тус тусад нь оруулах боломжтой.  
`mn` хэл хоосон байвал автоматаар `en` рүү буцна.
