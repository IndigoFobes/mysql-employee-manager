INSERT INTO department (name)
VALUES  ('Production'),
        ('Marketing'),
        ('Design'),
        ('Performace'),
        ('Sales');

INSERT INTO role (title, salary, department_id)
VALUES  ('Director', 60000, 1),
        ('Music Director', 60000, 1),
        ('Costume Designer', 55000, 3),
        ('Stitcher', 45000, 3),
        ('Actor', 45000, 4),
        ('Dance Captain', 48000, 4),
        ('Social Media Manager', 45000, 2),
        ('Box Office Manager', 48000, 5);


INSERT INTO employee (first_name, last_name, role, manager_id)
VALUES  ('Ginna', 'Richards', 6, null),
        ('Bob', 'Foster', 1, null),
        ('Marcus', 'Antonio', 5, 1),
        ('Lorraine', 'Flem', 3, null),
        ('Abi', 'Hannigan', 4, 4),
        ('George', 'Hersh', 2, 2);
        